from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.core.encryption import encrypt
from .models import User, GenderChoices
from .validators import validate_gemini_api_key


class RegisterSerializer(serializers.ModelSerializer):
    """
    Registration serializer.
    1. Validates the Gemini API key against Google's API before saving.
    2. Encrypts the key with Fernet before writing to DB.
    """

    password = serializers.CharField(write_only=True, validators=[validate_password])
    gemini_api_key = serializers.CharField(write_only=True)
    gender = serializers.ChoiceField(choices=GenderChoices.choices)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "age",
            "gender",
            "gemini_api_key",
        ]

    def validate_gemini_api_key(self, value: str) -> str:
        return validate_gemini_api_key(value)

    def create(self, validated_data: dict) -> User:
        raw_key = validated_data.pop("gemini_api_key")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.gemini_api_key_encrypted = encrypt(raw_key)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read-only profile serializer (never exposes the encrypted key)."""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "age",
            "gender",
            "date_joined",
        ]
        read_only_fields = fields


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Allows updating profile fields (not email, not api key)."""

    class Meta:
        model = User
        fields = ["first_name", "last_name", "age", "gender"]

    def update(self, instance: User, validated_data: dict) -> User:
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UpdateGeminiKeySerializer(serializers.Serializer):
    """Allows a user to replace their Gemini API key."""

    gemini_api_key = serializers.CharField()

    def validate_gemini_api_key(self, value: str) -> str:
        return validate_gemini_api_key(value)

    def save(self, user: User) -> User:
        raw_key = self.validated_data["gemini_api_key"]
        user.gemini_api_key_encrypted = encrypt(raw_key)
        user.save(update_fields=["gemini_api_key_encrypted"])
        return user
