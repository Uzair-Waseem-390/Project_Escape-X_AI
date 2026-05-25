from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings


def _get_cipher() -> Fernet:
    """Return a Fernet cipher using the project's FERNET_KEY setting."""
    return Fernet(settings.FERNET_KEY.encode() if isinstance(settings.FERNET_KEY, str) else settings.FERNET_KEY)


def encrypt(plain_text: str) -> str:
    """Encrypt a plain-text string and return a URL-safe base64 token."""
    return _get_cipher().encrypt(plain_text.encode()).decode()


def decrypt(token: str) -> str:
    """Decrypt a Fernet token back to plain text. Raises ValueError on failure."""
    try:
        return _get_cipher().decrypt(token.encode()).decode()
    except InvalidToken as exc:
        raise ValueError("Decryption failed: invalid or tampered token.") from exc
