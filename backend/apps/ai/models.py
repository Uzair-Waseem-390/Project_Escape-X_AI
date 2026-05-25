import uuid
from django.db import models
from django.conf import settings

from apps.core.constants import AIRequestType, Subject
from apps.game.models import GameSession


class AIInteraction(models.Model):
    """
    Stores every AI exchange within a game session.
    Provides persistent chat history so sessions survive page refreshes.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        GameSession, on_delete=models.CASCADE, related_name="ai_interactions"
    )
    question_order = models.PositiveSmallIntegerField(
        help_text="Which question (1–15) triggered this interaction."
    )
    subject = models.CharField(max_length=20, choices=Subject.choices, blank=True)
    request_type = models.CharField(
        max_length=20, choices=AIRequestType.choices
    )

    # The user's message / trigger
    user_message = models.TextField(blank=True)

    # AI response parts
    hint_text = models.TextField(blank=True)
    explanation_text = models.TextField(blank=True)
    youtube_title = models.CharField(max_length=512, blank=True)
    youtube_url = models.URLField(blank=True)

    # Full raw AI response (for debugging)
    raw_response = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ai_interactions"
        ordering = ["created_at"]

    def __str__(self):
        return f"AI [{self.request_type}] session={self.session_id} Q{self.question_order}"


class AIReport(models.Model):
    """
    Post-level AI-generated performance report.
    One report per completed session.
    """

    session = models.OneToOneField(
        GameSession, on_delete=models.CASCADE, related_name="ai_report"
    )
    strongest_subject = models.CharField(max_length=20, choices=Subject.choices, blank=True)
    weakest_subject = models.CharField(max_length=20, choices=Subject.choices, blank=True)
    summary = models.TextField()
    improvement_suggestions = models.TextField()
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ai_reports"

    def __str__(self):
        return f"AIReport for session {self.session_id}"
