from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Centralised exception handler.
    All API errors return a consistent shape:
        { "success": false, "error": "...", "details": {...} }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            "success": False,
            "error": _extract_message(response.data),
            "details": response.data,
        }
        response.data = error_data

    return response


def _extract_message(data) -> str:
    if isinstance(data, dict):
        for key in ("detail", "non_field_errors"):
            if key in data:
                value = data[key]
                return str(value[0]) if isinstance(value, list) else str(value)
        # Return first field error
        first_key = next(iter(data))
        value = data[first_key]
        return str(value[0]) if isinstance(value, list) else str(value)
    if isinstance(data, list):
        return str(data[0])
    return str(data)
