from django.urls import path
from .views import RegisterView, ProfileView, UpdateGeminiKeyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("gemini-key/", UpdateGeminiKeyView.as_view(), name="update-gemini-key"),
]
