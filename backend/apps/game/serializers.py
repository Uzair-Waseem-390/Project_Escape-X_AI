from rest_framework import serializers
from .models import (
    Question, GameSession, SessionQuestion,
    SubjectTimeLog, SubjectAnalytics, UserLevelProgress,
)


class QuestionSerializer(serializers.ModelSerializer):
    """Serializes a question for display — never exposes correct_option."""

    class Meta:
        model = Question
        fields = ["id", "text", "option_a", "option_b", "option_c", "option_d", "subject"]


class SessionQuestionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = SessionQuestion
        fields = ["order", "subject", "question", "is_correct", "user_answer"]


class SubjectTimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectTimeLog
        fields = ["subject", "time_spent_seconds"]


class GameSessionSerializer(serializers.ModelSerializer):
    """Full session detail with questions."""
    session_questions = SessionQuestionSerializer(many=True, read_only=True)
    subject_times = SubjectTimeLogSerializer(many=True, read_only=True)

    class Meta:
        model = GameSession
        fields = [
            "id", "level", "score", "status",
            "started_at", "ended_at",
            "hint_usage", "explanation_requests",
            "session_questions", "subject_times",
        ]


class StartSessionSerializer(serializers.Serializer):
    level = serializers.IntegerField(min_value=1, max_value=5)


class SubmitAnswerSerializer(serializers.Serializer):
    question_order = serializers.IntegerField(min_value=1, max_value=15)
    answer = serializers.ChoiceField(choices=["A", "B", "C", "D"])


class SubjectTimerSerializer(serializers.Serializer):
    subject = serializers.ChoiceField(choices=[s[0] for s in SubjectTimeLog._meta.get_field("subject").choices])
    action = serializers.ChoiceField(choices=["start", "stop"])


class SubjectAnalyticsSerializer(serializers.ModelSerializer):
    accuracy_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = SubjectAnalytics
        fields = [
            "subject", "total_questions", "correct_answers",
            "accuracy_percent", "total_time_seconds",
            "hint_usage", "explanation_requests", "updated_at",
        ]


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLevelProgress
        fields = ["highest_level_unlocked", "updated_at"]
