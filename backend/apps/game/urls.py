from django.urls import path
from .views import (
    StartSessionView,
    SessionDetailView,
    SubmitAnswerView,
    CompleteLevelView,
    SubjectTimerView,
    UserProgressView,
    SubjectAnalyticsView,
    SessionHistoryView,
)

urlpatterns = [
    # Session management
    path("sessions/", SessionHistoryView.as_view(), name="session-history"),
    path("sessions/start/", StartSessionView.as_view(), name="session-start"),
    path("sessions/<uuid:session_id>/", SessionDetailView.as_view(), name="session-detail"),
    path("sessions/<uuid:session_id>/answer/", SubmitAnswerView.as_view(), name="session-answer"),
    path("sessions/<uuid:session_id>/complete/", CompleteLevelView.as_view(), name="session-complete"),
    path("sessions/<uuid:session_id>/timer/", SubjectTimerView.as_view(), name="session-timer"),

    # Progress & analytics
    path("progress/", UserProgressView.as_view(), name="user-progress"),
    path("analytics/", SubjectAnalyticsView.as_view(), name="subject-analytics"),
]
