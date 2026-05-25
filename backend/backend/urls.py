from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT auth (SimpleJWT built-in views — no custom views)
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),

    # App routes
    path("api/users/", include("apps.users.urls")),
    path("api/game/", include("apps.game.urls")),
    path("api/ai/", include("apps.ai.urls")),
]
