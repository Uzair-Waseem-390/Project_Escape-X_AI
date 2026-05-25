from django.urls import path
from .views import (
    RequestAIAssistanceView,
    AIInteractionDetailView,
    SessionChatHistoryView,
    GenerateReportView,
    GetReportView,
)

urlpatterns = [
    # Trigger AI assistance (async)
    path("assist/", RequestAIAssistanceView.as_view(), name="ai-assist"),

    # Poll for interaction result
    path("interact/<uuid:interaction_id>/", AIInteractionDetailView.as_view(), name="ai-interact-detail"),

    # Chat history for a session
    path("sessions/<uuid:session_id>/history/", SessionChatHistoryView.as_view(), name="ai-session-history"),

    # Post-level report
    path("sessions/<uuid:session_id>/report/", GetReportView.as_view(), name="ai-report-get"),
    path("sessions/<uuid:session_id>/report/generate/", GenerateReportView.as_view(), name="ai-report-generate"),
]
