from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.repositories.vehicle_repository import VehicleRepository

class VehicleService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = VehicleRepository(db)

    def create(self, vehicle_in: VehicleCreate) -> Vehicle:
        vehicle = Vehicle(
            make=vehicle_in.make.strip(),
            model=vehicle_in.model.strip(),
            category=vehicle_in.category.strip(),
            price=vehicle_in.price,
            quantity=vehicle_in.quantity
        )
        return self.repo.create(vehicle)

    def get_by_id(self, vehicle_id: int) -> Vehicle:
        vehicle = self.repo.get_by_id(vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Vehicle with ID {vehicle_id} not found'
            )
        return vehicle

    def list_all(self) -> List[Vehicle]:
        return self.repo.list_all()

    def search(
        self,
        make: Optional[str] = None,
        model: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> List[Vehicle]:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail='min_price cannot be greater than max_price'
            )
        return self.repo.search(make, model, category, min_price, max_price)

    def update(self, vehicle_id: int, vehicle_in: VehicleUpdate) -> Vehicle:
        vehicle = self.get_by_id(vehicle_id)
        update_data = {
            'make': vehicle_in.make.strip(),
            'model': vehicle_in.model.strip(),
            'category': vehicle_in.category.strip(),
            'price': vehicle_in.price,
            'quantity': vehicle_in.quantity
        }
        return self.repo.update(vehicle, update_data)

    def delete(self, vehicle_id: int) -> dict:
        vehicle = self.get_by_id(vehicle_id)
        self.repo.delete(vehicle)
        return {'message': f'Vehicle {vehicle_id} deleted successfully'}
