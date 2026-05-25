"""
apps/core/test_utils.py

Shared test helpers. Import from here in all test modules — never duplicate.
"""

from unittest.mock import patch, MagicMock
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.encryption import encrypt
from apps.core.constants import (
    Subject, Difficulty, LEVEL_DIFFICULTY,
    SUBJECT_ORDER, QUESTIONS_PER_SUBJECT, TOTAL_LEVELS,
)
from apps.game.models import Question, GameSession, SessionQuestion, SubjectTimeLog
from apps.users.models import User


# ── User factory ──────────────────────────────────────────────────────────────

def make_user(
    email="player@test.com",
    password="Str0ngPass!",
    first_name="Test",
    last_name="Player",
    age=18,
    gender="male",
    gemini_key="test-gemini-key-abc123",
) -> User:
    """Create and return a User with an encrypted dummy Gemini key."""
    user = User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        age=age,
        gender=gender,
    )
    user.gemini_api_key_encrypted = encrypt(gemini_key)
    user.save(update_fields=["gemini_api_key_encrypted"])
    return user


# ── Question factory ──────────────────────────────────────────────────────────

def make_questions_for_level(level: int, per_subject: int = 10) -> list[Question]:
    """
    Bulk-create `per_subject` questions for every subject at the given level.
    Returns the created Question list.
    """
    difficulty = LEVEL_DIFFICULTY[level]
    questions = []
    for subject in SUBJECT_ORDER:
        for i in range(per_subject):
            questions.append(
                Question(
                    level=level,
                    subject=subject,
                    difficulty=difficulty,
                    text=f"Test Q{i} – {subject} L{level}",
                    option_a="Option A",
                    option_b="Option B",
                    option_c="Option C",
                    option_d="Option D",
                    correct_option="A",
                    explanation="A is correct.",
                )
            )
    return Question.objects.bulk_create(questions)


# ── Authenticated API client ──────────────────────────────────────────────────

def auth_client(user: User) -> APIClient:
    """Return an APIClient pre-loaded with the user's JWT access token."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client


# ── Mock patches ─────────────────────────────────────────────────────────────

def mock_gemini_valid():
    """Patch Gemini API validation so it always passes."""
    return patch(
        "apps.users.validators.genai.list_models",
        return_value=[MagicMock()],
    )


def mock_gemini_invalid():
    """Patch Gemini API validation so it always raises 403."""
    return patch(
        "apps.users.validators.genai.list_models",
        side_effect=Exception("403 API key invalid"),
    )


def mock_celery_task(task_path: str):
    """Patch a Celery task's .delay() to be a no-op, returns mock task id."""
    mock = MagicMock()
    mock.delay.return_value = MagicMock(id="mock-task-id")
    return patch(task_path, mock)


# ── Base test case ────────────────────────────────────────────────────────────

class EscapeXTestCase(TestCase):
    """
    Base class for all Escape-X tests.
    Sets up a default user + authenticated client + questions for level 1.
    Override `setUp` and call `super().setUp()` to extend.
    """

    def setUp(self):
        self.user = make_user()
        self.client = auth_client(self.user)
        # Seed questions for level 1 so engine can always select
        make_questions_for_level(level=1, per_subject=10)
