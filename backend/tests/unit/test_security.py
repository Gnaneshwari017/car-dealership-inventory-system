import pytest
from datetime import timedelta
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

class TestSecurity:
    def test_password_hashing_and_verification(self):
        password = 'SecurePassword123!'
        hashed = hash_password(password)
        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password('WrongPassword!', hashed) is False

    def test_jwt_token_creation_and_decoding(self):
        data = {'sub': 'user@example.com', 'role': 'USER', 'id': 1}
        token = create_access_token(data)
        assert isinstance(token, str)
        assert len(token) > 20

        decoded = decode_access_token(token)
        assert decoded is not None
        assert decoded['sub'] == 'user@example.com'
        assert decoded['role'] == 'USER'
        assert decoded['id'] == 1
        assert 'exp' in decoded

    def test_jwt_token_expired(self):
        data = {'sub': 'user@example.com', 'role': 'USER', 'id': 1}
        expired_token = create_access_token(data, expires_delta=timedelta(seconds=-10))
        decoded = decode_access_token(expired_token)
        assert decoded is None

    def test_invalid_jwt_token(self):
        decoded = decode_access_token('invalid.token.payload')
        assert decoded is None
