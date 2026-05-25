from celery import shared_task
from django.db import transaction
from django.db.models import F


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def update_analytics_task(self, session_id: str):
    """
    Aggregates per-subject stats from a completed session into SubjectAnalytics.
    Runs asynchronously so gameplay is never blocked.
    """
    try:
        from .models import GameSession, SubjectAnalytics, SubjectTimeLog, SessionQuestion

        session = GameSession.objects.get(id=session_id)

        # Gather subject-level stats from this session
        subject_data = _aggregate_session_subjects(session)

        with transaction.atomic():
            for subject, stats in subject_data.items():
                SubjectAnalytics.objects.update_or_create(
                    user=session.user,
                    subject=subject,
                    defaults={},
                )
                # Use F() expressions to safely increment without race conditions
                SubjectAnalytics.objects.filter(
                    user=session.user, subject=subject
                ).update(
                    total_questions=F("total_questions") + stats["total"],
                    correct_answers=F("correct_answers") + stats["correct"],
                    total_time_seconds=F("total_time_seconds") + stats["time_seconds"],
                    hint_usage=F("hint_usage") + stats["hints"],
                    explanation_requests=F("explanation_requests") + stats["explanations"],
                )

    except Exception as exc:
        raise self.retry(exc=exc)


def _aggregate_session_subjects(session) -> dict:
    """Build per-subject stats dict from a session's questions and time logs."""
    from .models import SessionQuestion, SubjectTimeLog
    from apps.ai.models import AIInteraction
    from apps.core.constants import AIRequestType

    result = {}

    questions_qs = (
        SessionQuestion.objects
        .filter(session=session, is_correct__isnull=False)
        .values("subject", "is_correct")
    )
    time_qs = SubjectTimeLog.objects.filter(session=session).values("subject", "time_spent_seconds")

    # Count hints and explanations per subject via AI interactions
    hint_qs = (
        AIInteraction.objects
        .filter(session=session, request_type=AIRequestType.HINT)
        .values("subject")
    )
    expl_qs = (
        AIInteraction.objects
        .filter(session=session, request_type=AIRequestType.EXPLANATION)
        .values("subject")
    )

    # Build base structure
    for row in questions_qs:
        subj = row["subject"]
        if subj not in result:
            result[subj] = {"total": 0, "correct": 0, "time_seconds": 0, "hints": 0, "explanations": 0}
        result[subj]["total"] += 1
        if row["is_correct"]:
            result[subj]["correct"] += 1

    for row in time_qs:
        subj = row["subject"]
        if subj not in result:
            result[subj] = {"total": 0, "correct": 0, "time_seconds": 0, "hints": 0, "explanations": 0}
        result[subj]["time_seconds"] += row["time_spent_seconds"]

    for row in hint_qs:
        subj = row["subject"]
        if subj in result:
            result[subj]["hints"] += 1

    for row in expl_qs:
        subj = row["subject"]
        if subj in result:
            result[subj]["explanations"] += 1

    return result
