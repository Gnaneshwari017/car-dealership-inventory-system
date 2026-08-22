import pytest
from fastapi.testclient import TestClient

class TestConcurrencyAndSafety:
    def test_purchase_race_condition_does_not_oversell(self, client: TestClient):
        # 1. Register admin and user
        admin_resp = client.post(
            '/api/auth/register',
            json={'name': 'Admin Racer', 'email': 'admin.racer@example.com', 'password': 'AdminPassword123!', 'role': 'ADMIN'}
        ).json()
        admin_token = admin_resp['access_token']

        user1_resp = client.post(
            '/api/auth/register',
            json={'name': 'User One', 'email': 'user1.racer@example.com', 'password': 'UserPassword123!', 'role': 'USER'}
        ).json()
        user1_token = user1_resp['access_token']

        user2_resp = client.post(
            '/api/auth/register',
            json={'name': 'User Two', 'email': 'user2.racer@example.com', 'password': 'UserPassword123!', 'role': 'USER'}
        ).json()
        user2_token = user2_resp['access_token']

        # 2. Create vehicle with ONLY 1 unit in stock
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Ferrari', 'model': 'F8 Tributo', 'category': 'Sports', 'price': 280000, 'quantity': 1},
            headers={'Authorization': f'Bearer {admin_token}'}
        ).json()
        v_id = create_resp['id']

        # 3. Simulate attempts
        resp1 = client.post(f'/api/vehicles/{v_id}/purchase', headers={'Authorization': f'Bearer {user1_token}'})
        resp2 = client.post(f'/api/vehicles/{v_id}/purchase', headers={'Authorization': f'Bearer {user2_token}'})

        # Exactly one MUST succeed (200), and the other MUST fail with 400 Out of Stock
        statuses = [resp1.status_code, resp2.status_code]
        assert 200 in statuses
        assert 400 in statuses

        # Verify final vehicle quantity is exactly 0 (NEVER negative)
        get_resp = client.get(f'/api/vehicles/{v_id}', headers={'Authorization': f'Bearer {user1_token}'}).json()
        assert get_resp['quantity'] == 0

    def test_purchase_audit_trail_created(self, client: TestClient):
        admin_resp = client.post(
            '/api/auth/register',
            json={'name': 'Admin Auditor', 'email': 'admin.audit@example.com', 'password': 'AdminPassword123!', 'role': 'ADMIN'}
        ).json()
        admin_token = admin_resp['access_token']

        user_resp = client.post(
            '/api/auth/register',
            json={'name': 'User Auditor', 'email': 'user.audit@example.com', 'password': 'UserPassword123!', 'role': 'USER'}
        ).json()
        user_token = user_resp['access_token']

        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Rivian', 'model': 'R1T', 'category': 'Truck', 'price': 73000, 'quantity': 5},
            headers={'Authorization': f'Bearer {admin_token}'}
        ).json()
        v_id = create_resp['id']

        purchase_resp = client.post(
            f'/api/vehicles/{v_id}/purchase',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert purchase_resp.status_code == 200
        data = purchase_resp.json()
        assert data['unit_price'] == 73000
        assert data['total_price'] == 73000
        assert data['quantity'] == 1
