from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.core.responses import success_response, created_response, error_response
from .models import GameSession, UserLevelProgress, SubjectAnalytics
from .services import GameService
from .serializers import (
    StartSessionSerializer,
    SubmitAnswerSerializer,
    SubjectTimerSerializer,
    GameSessionSerializer,
    SubjectAnalyticsSerializer,
    UserProgressSerializer,
)


class StartSessionView(APIView):
    """
    POST /api/game/sessions/start/
    Body: { "level": 1 }
    Creates a new game session with 15 randomly selected questions.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        level = serializer.validated_data["level"]

        try:
            session = GameService.start_session(user=request.user, level=level)
        except PermissionError as exc:
            return error_response(str(exc), status_code=status.HTTP_403_FORBIDDEN)
        except ValueError as exc:
            return error_response(str(exc))

        return created_response(
            data=GameSessionSerializer(session).data,
            message=f"Level {level} session started.",
        )


class SessionDetailView(APIView):
    """
    GET /api/game/sessions/<session_id>/
    Returns full session state (questions, score, timers).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        return success_response(data=GameSessionSerializer(session).data)


class SubmitAnswerView(APIView):
    """
    POST /api/game/sessions/<session_id>/answer/
    Body: { "question_order": 1, "answer": "A" }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = GameService.submit_answer(
                session=session,
                question_order=serializer.validated_data["question_order"],
                answer=serializer.validated_data["answer"],
            )
        except ValueError as exc:
            return error_response(str(exc))

        return success_response(data=result, message="Answer submitted.")


class CompleteLevelView(APIView):
    """
    POST /api/game/sessions/<session_id>/complete/
    Called when all questions are answered or timer expires.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        try:
            result = GameService.complete_level(session)
        except ValueError as exc:
            return error_response(str(exc))

        msg = "Level passed! Next level unlocked." if result["passed"] else "Level failed. Try again!"
        return success_response(data=result, message=msg)


class SubjectTimerView(APIView):
    """
    POST /api/game/sessions/<session_id>/timer/
    Body: { "subject": "math", "action": "start" | "stop" }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            GameSession, id=session_id, user=request.user
        )
        serializer = SubjectTimerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        subject = serializer.validated_data["subject"]
        action = serializer.validated_data["action"]

        if action == "start":
            GameService.start_subject_timer(session, subject)
        else:
            GameService.stop_subject_timer(session, subject)

        return success_response(message=f"Subject '{subject}' timer {action}ed.")


class UserProgressView(APIView):
    """GET /api/game/progress/ — highest unlocked level."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        progress, _ = UserLevelProgress.objects.get_or_create(
            user=request.user, defaults={"highest_level_unlocked": 1}
        )
        return success_response(data=UserProgressSerializer(progress).data)


class SubjectAnalyticsView(APIView):
    """GET /api/game/analytics/ — per-subject aggregated analytics."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        analytics = SubjectAnalytics.objects.filter(user=request.user)
        return success_response(
            data=SubjectAnalyticsSerializer(analytics, many=True).data
        )


class SessionHistoryView(generics.ListAPIView):
    """GET /api/game/sessions/ — list all past sessions for the user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GameSessionSerializer

    def get_queryset(self):
        return (
            GameSession.objects
            .filter(user=self.request.user)
            .prefetch_related("session_questions__question", "subject_times")
            .order_by("-started_at")
        )

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        return success_response(data=self.get_serializer(qs, many=True).data)
