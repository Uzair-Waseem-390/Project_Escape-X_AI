from django.utils import timezone
from django.db import transaction

from apps.core.constants import (
    POINTS_CORRECT, POINTS_WRONG, PASSING_SCORE,
    TOTAL_LEVELS, SUBJECT_ORDER,
)
from .models import (
    GameSession, SessionQuestion, SubjectTimeLog,
    UserLevelProgress, SubjectAnalytics,
)
from .engine import QuestionEngine


class GameService:
    """
    Centralised game business logic.
    All state-mutating operations go through here to keep views thin.
    """

    # ── Session lifecycle ──────────────────────────────────────────────────

    @staticmethod
    @transaction.atomic
    def start_session(user, level: int) -> GameSession:
        """Create a new GameSession and populate its questions."""
        _assert_level_unlocked(user, level)

        session = GameSession.objects.create(user=user, level=level)
        QuestionEngine.build_session_questions(session)

        # Initialise SubjectTimeLog rows (one per subject)
        SubjectTimeLog.objects.bulk_create([
            SubjectTimeLog(session=session, subject=subject)
            for subject in SUBJECT_ORDER
        ])
        return session

    @staticmethod
    @transaction.atomic
    def submit_answer(session: GameSession, question_order: int, answer: str) -> dict:
        """
        Process a single answer submission.
        Returns a dict with: is_correct, score, points_delta, correct_option.
        """
        _assert_session_active(session)

        sq: SessionQuestion = SessionQuestion.objects.select_related("question").get(
            session=session, order=question_order
        )

        if sq.is_correct is not None:
            raise ValueError("This question has already been answered.")

        answer = answer.upper().strip()
        is_correct = answer == sq.question.correct_option
        points_delta = POINTS_CORRECT if is_correct else -POINTS_WRONG

        sq.user_answer = answer
        sq.is_correct = is_correct
        sq.answered_at = timezone.now()
        sq.save(update_fields=["user_answer", "is_correct", "answered_at"])

        # Update score (floor at 0)
        new_score = max(0, session.score + points_delta)
        session.score = new_score
        session.save(update_fields=["score"])

        return {
            "is_correct": is_correct,
            "score": new_score,
            "points_delta": points_delta if is_correct else -POINTS_WRONG,
            "correct_option": sq.question.correct_option,
            "explanation": sq.question.explanation,
        }

    @staticmethod
    @transaction.atomic
    def complete_level(session: GameSession) -> dict:
        """
        Called when all 15 questions are answered OR timer expires.
        Determines pass/fail, unlocks next level, triggers analytics update.
        Returns completion summary.
        """
        _assert_session_active(session)

        passed = session.score >= PASSING_SCORE
        session.status = GameSession.Status.PASSED if passed else GameSession.Status.FAILED
        session.ended_at = timezone.now()
        session.save(update_fields=["status", "ended_at"])

        if passed:
            _unlock_next_level(session.user, session.level)

        # Fire async analytics update
        from apps.game.tasks import update_analytics_task
        update_analytics_task.delay(str(session.id))

        return {
            "passed": passed,
            "score": session.score,
            "level": session.level,
            "next_level": session.level + 1 if passed and session.level < TOTAL_LEVELS else None,
        }

    @staticmethod
    @transaction.atomic
    def timeout_session(session: GameSession) -> None:
        """Mark session as timed-out when the 15-minute timer expires."""
        if session.status != GameSession.Status.IN_PROGRESS:
            return
        session.status = GameSession.Status.TIMED_OUT
        session.ended_at = timezone.now()
        session.save(update_fields=["status", "ended_at"])

    # ── Subject time tracking ──────────────────────────────────────────────

    @staticmethod
    def start_subject_timer(session: GameSession, subject: str) -> None:
        SubjectTimeLog.objects.filter(session=session, subject=subject).update(
            started_at=timezone.now()
        )

    @staticmethod
    def stop_subject_timer(session: GameSession, subject: str) -> None:
        log = SubjectTimeLog.objects.filter(session=session, subject=subject).first()
        if log and log.started_at:
            elapsed = (timezone.now() - log.started_at).seconds
            log.time_spent_seconds += elapsed
            log.ended_at = timezone.now()
            log.save(update_fields=["ended_at", "time_spent_seconds"])


# ── Private helpers ────────────────────────────────────────────────────────────

def _assert_level_unlocked(user, level: int) -> None:
    progress, _ = UserLevelProgress.objects.get_or_create(
        user=user, defaults={"highest_level_unlocked": 1}
    )
    if level > progress.highest_level_unlocked:
        raise PermissionError(f"Level {level} is not yet unlocked.")


def _assert_session_active(session: GameSession) -> None:
    if session.status != GameSession.Status.IN_PROGRESS:
        raise ValueError(f"Session is not active (status: {session.status}).")


def _unlock_next_level(user, current_level: int) -> None:
    if current_level >= TOTAL_LEVELS:
        return
    next_level = current_level + 1
    UserLevelProgress.objects.update_or_create(
        user=user,
        defaults={"highest_level_unlocked": next_level},
    )
