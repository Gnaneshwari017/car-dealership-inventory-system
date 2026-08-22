from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.vehicle import Vehicle

class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def list_all(self) -> List[Vehicle]:
        return self.db.query(Vehicle).order_by(Vehicle.id.desc()).all()

    def search(
        self,
        make: Optional[str] = None,
        model: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> List[Vehicle]:
        query = self.db.query(Vehicle)

        if make and make.strip():
            query = query.filter(func.lower(Vehicle.make).contains(make.lower().strip()))
        if model and model.strip():
            query = query.filter(func.lower(Vehicle.model).contains(model.lower().strip()))
        if category and category.strip():
            query = query.filter(func.lower(Vehicle.category) == category.lower().strip())
        if min_price is not None:
            query = query.filter(Vehicle.price >= min_price)
        if max_price is not None:
            query = query.filter(Vehicle.price <= max_price)

        return query.order_by(Vehicle.id.desc()).all()

    def create(self, vehicle: Vehicle) -> Vehicle:
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def update(self, vehicle: Vehicle, update_data: dict) -> Vehicle:
        for key, value in update_data.items():
            if hasattr(vehicle, key):
                setattr(vehicle, key, value)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        self.db.delete(vehicle)
        self.db.commit()
