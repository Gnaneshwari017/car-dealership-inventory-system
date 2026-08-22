import pytest
from fastapi.testclient import TestClient
from app.core.security import hash_password
from app.models.user import User, UserRole

class TestAuthAPI:
    def test_register_user_success(self, client: TestClient):
        response = client.post(
            '/api/auth/register',
            json={
                'name': 'John Buyer',
                'email': 'john.buyer@example.com',
                'password': 'Password123!',
                'role': 'USER'
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert 'access_token' in data
        assert data['token_type'] == 'bearer'
        assert 'user' in data
        assert data['user']['email'] == 'john.buyer@example.com'
        assert data['user']['name'] == 'John Buyer'
        assert data['user']['role'] == 'USER'
        assert 'password' not in data['user']
        assert 'password_hash' not in data['user']

    def test_register_duplicate_email_fails(self, client: TestClient):
        payload = {
            'name': 'Duplicate User',
            'email': 'duplicate@example.com',
            'password': 'Password123!'
        }
        resp1 = client.post('/api/auth/register', json=payload)
        assert resp1.status_code == 201

        resp2 = client.post('/api/auth/register', json=payload)
        assert resp2.status_code == 409
        assert 'already registered' in resp2.json()['detail'].lower()

    def test_register_invalid_email_fails(self, client: TestClient):
        response = client.post(
            '/api/auth/register',
            json={
                'name': 'Invalid Email',
                'email': 'not-an-email',
                'password': 'Password123!'
            }
        )
        assert response.status_code == 422

    def test_register_short_password_fails(self, client: TestClient):
        response = client.post(
            '/api/auth/register',
            json={
                'name': 'Short Pass',
                'email': 'shortpass@example.com',
                'password': '123'
            }
        )
        assert response.status_code == 422

    def test_register_admin_user_success(self, client: TestClient):
        response = client.post(
            '/api/auth/register',
            json={
                'name': 'Admin Super',
                'email': 'admin.super@example.com',
                'password': 'AdminPassword123!',
                'role': 'ADMIN'
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data['user']['role'] == 'ADMIN'

    def test_login_success(self, client: TestClient):
        # Register user first
        client.post(
            '/api/auth/register',
            json={
                'name': 'Login User',
                'email': 'login.user@example.com',
                'password': 'CorrectPassword123!'
            }
        )

        # Login
        response = client.post(
            '/api/auth/login',
            json={
                'email': 'login.user@example.com',
                'password': 'CorrectPassword123!'
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert 'access_token' in data
        assert data['token_type'] == 'bearer'
        assert data['user']['email'] == 'login.user@example.com'

    def test_login_incorrect_password_fails(self, client: TestClient):
        client.post(
            '/api/auth/register',
            json={
                'name': 'Wrong Pass User',
                'email': 'wrong.pass@example.com',
                'password': 'CorrectPassword123!'
            }
        )

        response = client.post(
            '/api/auth/login',
            json={
                'email': 'wrong.pass@example.com',
                'password': 'WrongPassword123!'
            }
        )
        assert response.status_code == 401
        assert 'invalid' in response.json()['detail'].lower()

    def test_login_nonexistent_user_fails(self, client: TestClient):
        response = client.post(
            '/api/auth/login',
            json={
                'email': 'ghost@example.com',
                'password': 'SomePassword123!'
            }
        )
        assert response.status_code == 401
        assert 'invalid' in response.json()['detail'].lower()

    def test_get_current_user_me_endpoint(self, client: TestClient):
        # Register & get token
        reg = client.post(
            '/api/auth/register',
            json={
                'name': 'Me Test',
                'email': 'me.test@example.com',
                'password': 'Password123!'
            }
        ).json()
        token = reg['access_token']

        # Get /api/auth/me with Bearer token
        response = client.get(
            '/api/auth/me',
            headers={'Authorization': f'Bearer {token}'}
        )
        assert response.status_code == 200
        data = response.json()
        assert data['email'] == 'me.test@example.com'
        assert data['name'] == 'Me Test'

    def test_get_current_user_unauthorized_without_token(self, client: TestClient):
        response = client.get('/api/auth/me')
        assert response.status_code == 401
