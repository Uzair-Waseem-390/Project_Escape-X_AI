from rest_framework import serializers
from apps.core.constants import AIRequestType
from .models import AIInteraction, AIReport


class AIRequestSerializer(serializers.Serializer):
    """Validates an incoming AI assistance request from the frontend."""

    session_id = serializers.UUIDField()
    question_order = serializers.IntegerField(min_value=1, max_value=15)
    request_type = serializers.ChoiceField(choices=AIRequestType.choices)
    user_message = serializers.CharField(required=False, allow_blank=True, default="")


class AIInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteraction
        fields = [
            "id",
            "question_order",
            "subject",
            "request_type",
            "user_message",
            "hint_text",
            "explanation_text",
            "youtube_title",
            "youtube_url",
            "created_at",
        ]
        read_only_fields = fields


class AIReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIReport
        fields = [
            "strongest_subject",
            "weakest_subject",
            "summary",
            "improvement_suggestions",
            "generated_at",
        ]
        read_only_fields = fields
