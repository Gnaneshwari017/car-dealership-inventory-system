import pytest
from fastapi.testclient import TestClient

class TestVehiclesAPI:
    @pytest.fixture
    def user_token(self, client: TestClient):
        resp = client.post(
            '/api/auth/register',
            json={
                'name': 'Regular User',
                'email': 'regular.user@example.com',
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
                'name': 'Admin User',
                'email': 'admin.vehicles@example.com',
                'password': 'AdminPassword123!',
                'role': 'ADMIN'
            }
        )
        return resp.json()['access_token']

    def test_unauthenticated_requests_rejected(self, client: TestClient):
        assert client.get('/api/vehicles').status_code == 401
        assert client.post('/api/vehicles', json={'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': 25000, 'quantity': 5}).status_code == 401
        assert client.get('/api/vehicles/search?make=Toyota').status_code == 401
        assert client.put('/api/vehicles/1', json={'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': 25000, 'quantity': 5}).status_code == 401
        assert client.delete('/api/vehicles/1').status_code == 401

    def test_create_vehicle_success(self, client: TestClient, user_token: str):
        payload = {
            'make': 'Toyota',
            'model': 'Camry',
            'category': 'Sedan',
            'price': 26500.00,
            'quantity': 10
        }
        response = client.post(
            '/api/vehicles',
            json=payload,
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 201
        data = response.json()
        assert data['make'] == 'Toyota'
        assert data['model'] == 'Camry'
        assert data['category'] == 'Sedan'
        assert data['price'] == 26500.00
        assert data['quantity'] == 10
        assert 'id' in data

    def test_create_vehicle_invalid_price_fails(self, client: TestClient, user_token: str):
        # Zero price
        resp_zero = client.post(
            '/api/vehicles',
            json={'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': 0, 'quantity': 5},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp_zero.status_code == 422

        # Negative price
        resp_neg = client.post(
            '/api/vehicles',
            json={'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': -500, 'quantity': 5},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp_neg.status_code == 422

    def test_create_vehicle_negative_quantity_fails(self, client: TestClient, user_token: str):
        response = client.post(
            '/api/vehicles',
            json={'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan', 'price': 25000, 'quantity': -2},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 422

    def test_create_vehicle_missing_fields_fails(self, client: TestClient, user_token: str):
        response = client.post(
            '/api/vehicles',
            json={'price': 25000, 'quantity': 5},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 422

    def test_list_vehicles(self, client: TestClient, user_token: str):
        # Seed 2 vehicles
        client.post(
            '/api/vehicles',
            json={'make': 'Honda', 'model': 'Civic', 'category': 'Sedan', 'price': 22000, 'quantity': 4},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        client.post(
            '/api/vehicles',
            json={'make': 'Tesla', 'model': 'Model 3', 'category': 'Electric', 'price': 42000, 'quantity': 8},
            headers={'Authorization': f'Bearer {user_token}'}
        )

        response = client.get('/api/vehicles', headers={'Authorization': f'Bearer {user_token}'})
        assert response.status_code == 200
        vehicles = response.json()
        assert len(vehicles) >= 2
        makes = [v['make'] for v in vehicles]
        assert 'Honda' in makes
        assert 'Tesla' in makes

    def test_search_by_make(self, client: TestClient, user_token: str):
        client.post(
            '/api/vehicles',
            json={'make': 'Ford', 'model': 'Mustang', 'category': 'Sports', 'price': 35000, 'quantity': 3},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        # Search case-insensitive 'ford'
        response = client.get('/api/vehicles/search?make=ford', headers={'Authorization': f'Bearer {user_token}'})
        assert response.status_code == 200
        results = response.json()
        assert len(results) >= 1
        assert any(v['make'] == 'Ford' and v['model'] == 'Mustang' for v in results)

    def test_search_by_model(self, client: TestClient, user_token: str):
        client.post(
            '/api/vehicles',
            json={'make': 'BMW', 'model': 'X5', 'category': 'SUV', 'price': 65000, 'quantity': 2},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        response = client.get('/api/vehicles/search?model=x5', headers={'Authorization': f'Bearer {user_token}'})
        assert response.status_code == 200
        results = response.json()
        assert any(v['model'] == 'X5' for v in results)

    def test_search_by_category(self, client: TestClient, user_token: str):
        client.post(
            '/api/vehicles',
            json={'make': 'Hyundai', 'model': 'Creta', 'category': 'SUV', 'price': 18000, 'quantity': 7},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        response = client.get('/api/vehicles/search?category=SUV', headers={'Authorization': f'Bearer {user_token}'})
        assert response.status_code == 200
        results = response.json()
        assert all(v['category'].upper() == 'SUV' for v in results)

    def test_search_by_price_range(self, client: TestClient, user_token: str):
        response = client.get(
            '/api/vehicles/search?min_price=20000&max_price=40000',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 200
        results = response.json()
        for v in results:
            assert 20000 <= v['price'] <= 40000

    def test_search_combined_filters(self, client: TestClient, user_token: str):
        client.post(
            '/api/vehicles',
            json={'make': 'Porsche', 'model': '911', 'category': 'Sports', 'price': 115000, 'quantity': 1},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        response = client.get(
            '/api/vehicles/search?make=Porsche&category=Sports&min_price=100000',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 200
        results = response.json()
        assert len(results) >= 1
        assert results[0]['model'] == '911'

    def test_update_vehicle_success(self, client: TestClient, user_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Nissan', 'model': 'Altima', 'category': 'Sedan', 'price': 24000, 'quantity': 5},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        v_id = create_resp.json()['id']

        update_resp = client.put(
            f'/api/vehicles/{v_id}',
            json={'make': 'Nissan', 'model': 'Altima SV', 'category': 'Sedan', 'price': 26000, 'quantity': 6},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert update_resp.status_code == 200
        updated = update_resp.json()
        assert updated['model'] == 'Altima SV'
        assert updated['price'] == 26000
        assert updated['quantity'] == 6

    def test_update_nonexistent_vehicle_fails(self, client: TestClient, user_token: str):
        response = client.put(
            '/api/vehicles/99999',
            json={'make': 'Ghost', 'model': 'Phantom', 'category': 'Luxury', 'price': 500000, 'quantity': 1},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert response.status_code == 404

    def test_delete_vehicle_by_admin_succeeds(self, client: TestClient, admin_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Chevrolet', 'model': 'Corvette', 'category': 'Sports', 'price': 70000, 'quantity': 2},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        delete_resp = client.delete(
            f'/api/vehicles/{v_id}',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        assert delete_resp.status_code in [200, 204]

        # Verify it is deleted
        get_resp = client.get('/api/vehicles', headers={'Authorization': f'Bearer {admin_token}'})
        assert not any(v['id'] == v_id for v in get_resp.json())

    def test_delete_vehicle_by_normal_user_fails(self, client: TestClient, user_token: str, admin_token: str):
        create_resp = client.post(
            '/api/vehicles',
            json={'make': 'Mazda', 'model': 'CX-5', 'category': 'SUV', 'price': 29000, 'quantity': 4},
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        v_id = create_resp.json()['id']

        # Normal user attempts to delete
        delete_resp = client.delete(
            f'/api/vehicles/{v_id}',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert delete_resp.status_code == 403
        assert 'admin' in delete_resp.json()['detail'].lower()
