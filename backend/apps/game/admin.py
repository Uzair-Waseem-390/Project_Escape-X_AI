from django.contrib import admin
from .models import (
    Question, GameSession, SessionQuestion,
    SubjectTimeLog, UserLevelProgress, SubjectAnalytics,
)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "level", "subject", "difficulty", "text_preview")
    list_filter = ("level", "subject", "difficulty")
    search_fields = ("text",)

    def text_preview(self, obj):
        return obj.text[:60]
    text_preview.short_description = "Question"


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "level", "score", "status", "started_at")
    list_filter = ("level", "status")
    search_fields = ("user__email",)
    readonly_fields = ("id", "started_at", "ended_at")


@admin.register(SessionQuestion)
class SessionQuestionAdmin(admin.ModelAdmin):
    list_display = ("session", "order", "subject", "is_correct", "user_answer")
    list_filter = ("subject", "is_correct")


@admin.register(SubjectAnalytics)
class SubjectAnalyticsAdmin(admin.ModelAdmin):
    list_display = ("user", "subject", "total_questions", "correct_answers", "accuracy_percent")
    list_filter = ("subject",)


admin.site.register(SubjectTimeLog)
admin.site.register(UserLevelProgress)
