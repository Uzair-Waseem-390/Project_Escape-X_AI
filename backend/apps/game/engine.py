import random
from django.db.models import QuerySet

from apps.core.constants import (
    SUBJECT_ORDER, QUESTIONS_PER_SUBJECT,
    LEVEL_DIFFICULTY, QUESTION_POOL_SIZE,
)
from .models import Question, GameSession, SessionQuestion


class QuestionEngine:
    """
    Responsible for selecting and persisting the randomised question set
    for a new game session.

    Design:
    - Fetches up to QUESTION_POOL_SIZE questions per subject for the level.
    - Randomly samples QUESTIONS_PER_SUBJECT from that pool.
    - Assigns sequential order following SUBJECT_ORDER.
    - All selection + persistence is done in one call: `build_session_questions`.
    """

    @staticmethod
    def _fetch_pool(level: int, subject: str) -> QuerySet:
        difficulty = LEVEL_DIFFICULTY[level]
        return Question.objects.filter(
            level=level,
            subject=subject,
            difficulty=difficulty,
        ).values_list("id", flat=True)[:QUESTION_POOL_SIZE]

    @classmethod
    def select_questions(cls, level: int) -> list[dict]:
        """
        Returns an ordered list of dicts:
            [{"question_id": int, "subject": str, "order": int}, ...]
        """
        selected = []
        order_counter = 1

        for subject in SUBJECT_ORDER:
            pool = list(cls._fetch_pool(level, subject))
            if len(pool) < QUESTIONS_PER_SUBJECT:
                raise ValueError(
                    f"Not enough questions in DB for level={level} subject={subject}. "
                    f"Need {QUESTIONS_PER_SUBJECT}, found {len(pool)}."
                )
            chosen_ids = random.sample(pool, QUESTIONS_PER_SUBJECT)
            for qid in chosen_ids:
                selected.append({
                    "question_id": qid,
                    "subject": subject,
                    "order": order_counter,
                })
                order_counter += 1

        return selected

    @classmethod
    def build_session_questions(cls, session: GameSession) -> list[SessionQuestion]:
        """
        Selects questions and bulk-creates SessionQuestion rows.
        Returns the list of created SessionQuestion objects.
        """
        question_data = cls.select_questions(session.level)

        session_questions = [
            SessionQuestion(
                session=session,
                question_id=item["question_id"],
                subject=item["subject"],
                order=item["order"],
            )
            for item in question_data
        ]
        return SessionQuestion.objects.bulk_create(session_questions)
