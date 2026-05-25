from rest_framework.views import APIView
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from celery.result import AsyncResult

from apps.core.responses import success_response, created_response, error_response
from apps.game.models import GameSession, SessionQuestion
from .models import AIInteraction, AIReport
from .serializers import AIRequestSerializer, AIInteractionSerializer, AIReportSerializer
from .tasks import run_ai_interaction_task, generate_level_report_task


class RequestAIAssistanceView(APIView):
    """
    POST /api/ai/assist/
    Triggers the LangGraph agent asynchronously.
    Returns immediately with interaction_id + task_id.
    Frontend polls /api/ai/interact/<interaction_id>/ for results.

    Body:
    {
        "session_id": "uuid",
        "question_order": 1,
        "request_type": "hint" | "explanation" | "wrong_answer",
        "user_message": "optional user text"
    }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AIRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        session = get_object_or_404(
            GameSession, id=data["session_id"], user=request.user
        )

        # Verify question exists in this session
        sq = get_object_or_404(
            SessionQuestion,
            session=session,
            order=data["question_order"],
        )

        # Create the interaction row (initially empty — agent fills it)
        interaction = AIInteraction.objects.create(
            session=session,
            question_order=data["question_order"],
            subject=sq.subject,
            request_type=data["request_type"],
            user_message=data["user_message"],
        )

        # Track usage counters on session
        if data["request_type"] == "hint":
            session.hint_usage += 1
        else:
            session.explanation_requests += 1
        session.save(update_fields=["hint_usage", "explanation_requests"])

        # Dispatch async task
        task = run_ai_interaction_task.delay(str(interaction.id))

        return created_response(
            data={
                "interaction_id": str(interaction.id),
                "task_id": task.id,
                "status": "processing",
            },
            message="AI request queued. Poll /api/ai/interact/<interaction_id>/ for results.",
        )


class AIInteractionDetailView(APIView):
    """
    GET /api/ai/interact/<interaction_id>/
    Polls for the completed AI response.
    Returns the full interaction once the Celery task has written results.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, interaction_id):
        interaction = get_object_or_404(
            AIInteraction,
            id=interaction_id,
            session__user=request.user,
        )

        # Determine if the AI has responded yet
        is_ready = bool(interaction.hint_text or interaction.explanation_text)
        response_data = AIInteractionSerializer(interaction).data
        response_data["ready"] = is_ready

        return success_response(data=response_data)


class SessionChatHistoryView(APIView):
    """
    GET /api/ai/sessions/<session_id>/history/
    Returns all AI interactions for a session (persistent chat history).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        interactions = session.ai_interactions.all()
        return success_response(
            data=AIInteractionSerializer(interactions, many=True).data
        )


class GenerateReportView(APIView):
    """
    POST /api/ai/sessions/<session_id>/report/
    Triggers async generation of post-level AI report.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        if session.status == GameSession.Status.IN_PROGRESS:
            return error_response("Session is still in progress. Complete the level first.")

        task = generate_level_report_task.delay(str(session.id))
        return success_response(
            data={"task_id": task.id},
            message="Report generation queued.",
        )


class GetReportView(APIView):
    """
    GET /api/ai/sessions/<session_id>/report/
    Returns the AI performance report for a completed session.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        report = get_object_or_404(AIReport, session=session)
        return success_response(data=AIReportSerializer(report).data)
