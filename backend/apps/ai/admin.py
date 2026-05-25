from django.contrib import admin
from .models import AIInteraction, AIReport


@admin.register(AIInteraction)
class AIInteractionAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "question_order", "subject", "request_type", "created_at")
    list_filter = ("request_type", "subject")
    search_fields = ("session__user__email",)
    readonly_fields = ("id", "created_at", "raw_response")


@admin.register(AIReport)
class AIReportAdmin(admin.ModelAdmin):
    list_display = ("session", "strongest_subject", "weakest_subject", "generated_at")
    readonly_fields = ("generated_at",)
