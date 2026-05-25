import google.generativeai as genai
from rest_framework import serializers


def validate_gemini_api_key(api_key: str) -> str:
    """
    Validates a Gemini API key by making a lightweight models.list() call.
    Raises serializers.ValidationError with a descriptive message on failure.
    Returns the original api_key on success.
    """
    if not api_key or not api_key.strip():
        raise serializers.ValidationError("Gemini API key cannot be empty.")

    try:
        genai.configure(api_key=api_key.strip())
        # Lightweight probe — just list models, no generation cost
        models = list(genai.list_models())
        if not models:
            raise serializers.ValidationError(
                "Gemini API key appears valid but returned no models. Please check your key."
            )
    except Exception as exc:
        error_msg = str(exc).lower()
        if "api key" in error_msg or "invalid" in error_msg or "403" in error_msg or "401" in error_msg:
            raise serializers.ValidationError(
                "Invalid Gemini API key. Please provide a valid key from https://aistudio.google.com/app/apikey"
            )
        # Network or other transient error — still block registration
        raise serializers.ValidationError(
            f"Could not validate Gemini API key: {str(exc)}"
        )

    return api_key.strip()
