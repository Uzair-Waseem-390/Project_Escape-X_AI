import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.core.constants import (
    Subject, Difficulty, LEVEL_DIFFICULTY,
    TOTAL_LEVELS, MAX_SCORE_PER_LEVEL,
)


class Question(models.Model):
    """
    Master question bank.
    Each question belongs to a subject, has a difficulty level,
    four options, and a single correct answer.
    """

    subject = models.CharField(max_length=20, choices=Subject.choices, db_index=True)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, db_index=True)
    level = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(TOTAL_LEVELS)],
        db_index=True,
    )
    text = models.TextField()
    option_a = models.CharField(max_length=512)
    option_b = models.CharField(max_length=512)
    option_c = models.CharField(max_length=512)
    option_d = models.CharField(max_length=512)
    correct_option = models.CharField(
        max_length=1,
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")],
    )
    explanation = models.TextField(blank=True, help_text="Static explanation shown after wrong answer.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "questions"
        indexes = [
            models.Index(fields=["level", "subject", "difficulty"]),
        ]

    def __str__(self):
        return f"[L{self.level}][{self.subject}] {self.text[:60]}"


class GameSession(models.Model):
    """
    One gameplay attempt for a user on a specific level.
    Each retry creates a new session.
    """

    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "In Progress"
        PASSED = "passed", "Passed"
        FAILED = "failed", "Failed"
        TIMED_OUT = "timed_out", "Timed Out"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    level = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(TOTAL_LEVELS)]
    )
    score = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.IN_PROGRESS
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    hint_usage = models.PositiveSmallIntegerField(default=0)
    explanation_requests = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "game_sessions"
        ordering = ["-started_at"]

    def __str__(self):
        return f"Session {self.id} — {self.user.email} L{self.level} [{self.status}]"

    @property
    def passed(self) -> bool:
        from apps.core.constants import PASSING_SCORE
        return self.score >= PASSING_SCORE


class SessionQuestion(models.Model):
    """
    Junction table: which questions were selected for a session,
    in what order, and how the user answered them.
    """

    session = models.ForeignKey(
        GameSession, on_delete=models.CASCADE, related_name="session_questions"
    )
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="session_appearances"
    )
    order = models.PositiveSmallIntegerField()  # 1–15
    subject = models.CharField(max_length=20, choices=Subject.choices)

    # Answer tracking
    user_answer = models.CharField(max_length=1, blank=True, default="")
    is_correct = models.BooleanField(null=True, blank=True)
    answered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "session_questions"
        unique_together = [("session", "order")]
        ordering = ["order"]

    def __str__(self):
        return f"Session {self.session_id} Q{self.order}"


class SubjectTimeLog(models.Model):
    """
    Tracks time spent per subject within a session.
    One row per subject per session.
    """

    session = models.ForeignKey(
        GameSession, on_delete=models.CASCADE, related_name="subject_times"
    )
    subject = models.CharField(max_length=20, choices=Subject.choices)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "subject_time_logs"
        unique_together = [("session", "subject")]

    def __str__(self):
        return f"{self.session_id} — {self.subject}: {self.time_spent_seconds}s"


class UserLevelProgress(models.Model):
    """
    Tracks the highest level unlocked per user.
    Created once per user; updated as they pass levels.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_progress",
    )
    highest_level_unlocked = models.PositiveSmallIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_level_progress"

    def __str__(self):
        return f"{self.user.email} — max level {self.highest_level_unlocked}"


class SubjectAnalytics(models.Model):
    """
    Aggregated per-user, per-subject analytics across all sessions.
    Upserted after every session completion.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subject_analytics",
    )
    subject = models.CharField(max_length=20, choices=Subject.choices)
    total_questions = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    total_time_seconds = models.PositiveIntegerField(default=0)
    hint_usage = models.PositiveIntegerField(default=0)
    explanation_requests = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "subject_analytics"
        unique_together = [("user", "subject")]

    def __str__(self):
        return f"{self.user.email} — {self.subject}"

    @property
    def accuracy_percent(self) -> float:
        if self.total_questions == 0:
            return 0.0
        return round((self.correct_answers / self.total_questions) * 100, 1)
