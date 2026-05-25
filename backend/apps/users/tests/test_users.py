"""
Tests for apps.users

Coverage:
  - Registration: success, duplicate email, invalid Gemini key, weak password
  - Login (JWT token obtain)
  - Profile: fetch, update
  - Gemini key update
  - Encryption: key is never stored plain text
"""

from django.urls import reverse
from rest_framework import status

from apps.core.test_utils import EscapeXTestCase, make_user, mock_gemini_valid, mock_gemini_invalid
from apps.core.encryption import decrypt
from apps.users.models import User


REGISTER_URL = "/api/users/register/"
PROFILE_URL = "/api/users/profile/"
GEMINI_KEY_URL = "/api/users/gemini-key/"
TOKEN_URL = "/api/auth/token/"


class RegistrationTests(EscapeXTestCase):

    def _valid_payload(self, email="new@test.com"):
        return {
            "email": email,
            "password": "Str0ngPass!99",
            "first_name": "Ali",
            "last_name": "Khan",
            "age": 17,
            "gender": "male",
            "gemini_api_key": "valid-key-abc",
        }

    def test_register_success_returns_tokens(self):
        """Successful registration returns access + refresh tokens and user data."""
        with mock_gemini_valid():
            res = self.client.post(REGISTER_URL, self._valid_payload(), format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data["success"])
        self.assertIn("access", res.data["data"]["tokens"])
        self.assertIn("refresh", res.data["data"]["tokens"])
        self.assertEqual(res.data["data"]["user"]["email"], "new@test.com")

    def test_register_creates_user_in_db(self):
        with mock_gemini_valid():
            self.client.post(REGISTER_URL, self._valid_payload(email="db@test.com"), format="json")
        self.assertTrue(User.objects.filter(email="db@test.com").exists())

    def test_gemini_key_stored_encrypted(self):
        """The Gemini API key must NEVER be stored as plain text."""
        with mock_gemini_valid():
            self.client.post(REGISTER_URL, self._valid_payload(email="enc@test.com"), format="json")
        user = User.objects.get(email="enc@test.com")
        # Raw DB field must not equal the plain key
        self.assertNotEqual(user.gemini_api_key_encrypted, "valid-key-abc")
        # But decrypting it should give the plain key back
        self.assertEqual(decrypt(user.gemini_api_key_encrypted), "valid-key-abc")

    def test_register_invalid_gemini_key_returns_400(self):
        with mock_gemini_invalid():
            res = self.client.post(REGISTER_URL, self._valid_payload(), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data["success"])
        self.assertIn("Gemini", res.data["error"])

    def test_register_duplicate_email_returns_400(self):
        """Cannot register the same email twice."""
        with mock_gemini_valid():
            self.client.post(REGISTER_URL, self._valid_payload(email=self.user.email), format="json")
        with mock_gemini_valid():
            res = self.client.post(REGISTER_URL, self._valid_payload(email=self.user.email), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_weak_password_returns_400(self):
        payload = self._valid_payload()
        payload["password"] = "123"
        with mock_gemini_valid():
            res = self.client.post(REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_fields_returns_400(self):
        res = self.client.post(REGISTER_URL, {"email": "x@x.com"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_gender_choice_returns_400(self):
        payload = self._valid_payload()
        payload["gender"] = "alien"
        with mock_gemini_valid():
            res = self.client.post(REGISTER_URL, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(EscapeXTestCase):

    def test_login_returns_tokens(self):
        res = self.client.post(
            TOKEN_URL,
            {"email": self.user.email, "password": "Str0ngPass!"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_login_wrong_password_returns_401(self):
        res = self.client.post(
            TOKEN_URL,
            {"email": self.user.email, "password": "wrongpassword"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user_returns_401(self):
        res = self.client.post(
            TOKEN_URL,
            {"email": "ghost@test.com", "password": "anything"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileTests(EscapeXTestCase):

    def test_get_profile_returns_user_data(self):
        res = self.client.get(PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["data"]["email"], self.user.email)
        self.assertEqual(res.data["data"]["first_name"], self.user.first_name)

    def test_profile_does_not_expose_gemini_key(self):
        res = self.client.get(PROFILE_URL)
        data_str = str(res.data)
        self.assertNotIn("gemini", data_str.lower())
        self.assertNotIn("api_key", data_str.lower())

    def test_profile_unauthenticated_returns_401(self):
        from rest_framework.test import APIClient
        res = APIClient().get(PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_success(self):
        res = self.client.patch(
            PROFILE_URL,
            {"first_name": "Updated", "age": 20},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["data"]["first_name"], "Updated")
        self.assertEqual(res.data["data"]["age"], 20)

    def test_update_profile_partial(self):
        """PATCH with only one field should not wipe other fields."""
        res = self.client.patch(PROFILE_URL, {"last_name": "Updated"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["data"]["first_name"], self.user.first_name)  # unchanged


class UpdateGeminiKeyTests(EscapeXTestCase):

    def test_update_gemini_key_success(self):
        with mock_gemini_valid():
            res = self.client.patch(
                GEMINI_KEY_URL,
                {"gemini_api_key": "new-valid-key-xyz"},
                format="json",
            )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])

        # Verify the new key is encrypted in DB
        self.user.refresh_from_db()
        self.assertEqual(decrypt(self.user.gemini_api_key_encrypted), "new-valid-key-xyz")

    def test_update_gemini_key_invalid_returns_400(self):
        with mock_gemini_invalid():
            res = self.client.patch(
                GEMINI_KEY_URL,
                {"gemini_api_key": "bad-key"},
                format="json",
            )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
