import pytest
from fastapi.testclient import TestClient

class TestInventoryAPI:
    @pytest.fixture
    def user_token(self, client: TestClient):
        resp = client.post(
            '/api/auth/register',
            json={
                'name': 'Buyer Persona',
                'email': 'buyer.inventory@example.com',
                'password': 'Password123!',
                'role': 'USER'
            }
        )
        return resp.json()['access_token']

    @pytest.fixture
    def admin_token(self, client: TestClient):
        resp = client.post(
            '/api/auth/register',
            json={
                'name': 'Admin Inventory',
                'email': 'admin.inventory@example.com',
                'password': 'AdminPassword123!',
                'role': 'ADMIN'
            }
        )
        return resp.json()['access_token']

    def test_purchase_unauthenticated_rejected(self, client: TestClient):
        response = client.post('/api/vehicles/1/purchase')
        assert response.status_code == 401

    def test_purchase_vehicle_success_and_decrements_quantity(self, client: TestClient, user_token: str, admin_token: str):
        # Create vehicle with quantity 2
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Toyota', 'model': 'RAV4', 'category': 'SUV', 'price': 31000, 'quantity': 2},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        # Purchase 1st unit
        resp1 = client.post(
            f'/api/vehicles/{v_id}/purchase',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp1.status_code == 200
        data1 = resp1.json()
        assert data1['vehicle']['quantity'] == 1
        assert 'purchase_id' in data1
        assert data1['total_price'] == 31000

        # Purchase 2nd unit (reaches 0)
        resp2 = client.post(
            f'/api/vehicles/{v_id}/purchase',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp2.status_code == 200
        assert resp2.json()['vehicle']['quantity'] == 0

    def test_purchase_out_of_stock_rejected(self, client: TestClient, user_token: str, admin_token: str):
        # Create vehicle with quantity 0
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Lucid', 'model': 'Air', 'category': 'Electric', 'price': 85000, 'quantity': 0},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        # Attempt purchase on 0 stock
        response = client.post(
            f'/api/vehicles/{v_id}/purchase',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 400
        assert 'out of stock' in response.json()['detail'].lower()

    def test_purchase_nonexistent_vehicle_fails(self, client: TestClient, user_token: str):
        response = client.post(
            '/api/vehicles/99999/purchase',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 404

    def test_restock_by_admin_succeeds(self, client: TestClient, admin_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Honda', 'model': 'CR-V', 'category': 'SUV', 'price': 32000, 'quantity': 3},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        restock_resp = client.post(
            f'/api/vehicles/{v_id}/restock',
            json={'quantity': 5},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        assert restock_resp.status_code == 200
        data = restock_resp.json()
        assert data['vehicle']['quantity'] == 8
        assert data['added_quantity'] == 5

    def test_restock_invalid_quantity_rejected(self, client: TestClient, admin_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Volvo', 'model': 'XC90', 'category': 'SUV', 'price': 60000, 'quantity': 1},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        # Zero quantity
        resp_zero = client.post(
            f'/api/vehicles/{v_id}/restock',
            json={'quantity': 0},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        assert resp_zero.status_code in [400, 422]

        # Negative quantity
        resp_neg = client.post(
            f'/api/vehicles/{v_id}/restock',
            json={'quantity': -3},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        assert resp_neg.status_code in [400, 422]

    def test_restock_by_normal_user_fails(self, client: TestClient, user_token: str, admin_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Audi', 'model': 'A4', 'category': 'Sedan', 'price': 41000, 'quantity': 2},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        response = client.post(
            f'/api/vehicles/{v_id}/restock',
            json={'quantity': 5},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 403
        assert 'admin' in response.json()['detail'].lower()

    def test_restock_nonexistent_vehicle_fails(self, client: TestClient, admin_token: str):
        response = client.post(
            '/api/vehicles/99999/restock',
            json={'quantity': 5},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        assert response.status_code == 404
