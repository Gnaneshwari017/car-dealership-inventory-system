import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle
from app.models.purchase import Purchase
from app.repositories.purchase_repository import PurchaseRepository
from app.repositories.user_repository import UserRepository
from app.utils.seed import seed_database
from app.core.config import Settings

class TestRepositoriesAndSeed:
    def test_purchase_repository_crud(self, db_session: Session):
        user_repo = UserRepository(db_session)
        user = user_repo.create(User(name='Repo Tester', email='repo@example.com', password_hash='hash123', role=UserRole.USER))

        vehicle = Vehicle(make='Volvo', model='V60', category='Sedan', price=40000, quantity=3)
        db_session.add(vehicle)
        db_session.commit()
        db_session.refresh(vehicle)

        purchase_repo = PurchaseRepository(db_session)
        purchase = Purchase(vehicle_id=vehicle.id, user_id=user.id, quantity=1, unit_price=40000, total_price=40000)
        created = purchase_repo.create(purchase)

        assert created.id is not None
        fetched = purchase_repo.get_by_id(created.id)
        assert fetched is not None
        assert fetched.vehicle_id == vehicle.id

        user_purchases = purchase_repo.list_by_user(user.id)
        assert len(user_purchases) == 1
        assert user_purchases[0].id == created.id

    def test_user_repository_get_by_id(self, db_session: Session):
        user_repo = UserRepository(db_session)
        user = user_repo.create(User(name='Id User', email='id.user@example.com', password_hash='hash123', role=UserRole.USER))
        found = user_repo.get_by_id(user.id)
        assert found is not None
        assert found.email == 'id.user@example.com'

    def test_seed_database_function(self, db_session: Session):
        seed_database(db_session)
        user_repo = UserRepository(db_session)
        admin = user_repo.get_by_email('admin@dealership.com')
        assert admin is not None
        assert admin.role == UserRole.ADMIN

    def test_health_check_endpoint(self, client: TestClient):
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json()['status'] == 'healthy'

    def test_settings_cors_parsing(self):
        s1 = Settings(CORS_ORIGINS='http://localhost:3000, http://localhost:5173')
        assert 'http://localhost:3000' in s1.CORS_ORIGINS
        s2 = Settings(CORS_ORIGINS='["http://localhost:8080"]')
        assert 'http://localhost:8080' in s2.CORS_ORIGINS
