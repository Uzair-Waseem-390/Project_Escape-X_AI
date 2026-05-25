from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.responses import success_response, created_response
from .models import User
from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    UpdateProfileSerializer,
    UpdateGeminiKeySerializer,
)


class RegisterView(generics.CreateAPIView):
    """
    POST /api/users/register/
    Public endpoint. Validates Gemini key, encrypts it, creates user.
    Returns JWT tokens immediately so the user is logged in after signup.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: User = serializer.save()

        # Issue tokens immediately
        refresh = RefreshToken.for_user(user)
        data = {
            "user": UserProfileSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
        }
        return created_response(data=data, message="Account created successfully.")


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/users/profile/  — fetch own profile
    PATCH /api/users/profile/ — update name/age/gender
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self) -> User:
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UpdateProfileSerializer
        return UserProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return success_response(data=serializer.data)

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        serializer = self.get_serializer(
            self.get_object(), data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success_response(
            data=UserProfileSerializer(user).data,
            message="Profile updated successfully.",
        )


class UpdateGeminiKeyView(generics.UpdateAPIView):
    """
    PATCH /api/users/gemini-key/
    Allows user to replace their stored (encrypted) Gemini API key.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UpdateGeminiKeySerializer
    http_method_names = ["patch"]

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return success_response(message="Gemini API key updated successfully.")
