from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import update
from fastapi import HTTPException, status
from app.models.vehicle import Vehicle
from app.models.purchase import Purchase
from app.models.user import User
from app.schemas.inventory import RestockRequest, RestockResponse, PurchaseResponse
from app.schemas.vehicle import VehicleResponse
from app.repositories.vehicle_repository import VehicleRepository

class InventoryService:
    def __init__(self, db: Session):
        self.db = db
        self.vehicle_repo = VehicleRepository(db)

    def purchase_vehicle(self, vehicle_id: int, user: User, quantity: int = 1) -> PurchaseResponse:
        # Verify vehicle exists
        vehicle = self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Vehicle with ID {vehicle_id} not found'
            )

        # Atomic update with strict inventory guard (prevents negative inventory & race conditions)
        stmt = (
            update(Vehicle)
            .where(Vehicle.id == vehicle_id, Vehicle.quantity >= quantity)
            .values(
                quantity=Vehicle.quantity - quantity,
                updated_at=datetime.now(timezone.utc)
            )
        )
        result = self.db.execute(stmt)
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Vehicle is out of stock'
            )

        # Refresh updated vehicle state
        self.db.refresh(vehicle)

        # Record purchase audit record
        unit_price = float(vehicle.price)
        total_price = unit_price * quantity
        purchase = Purchase(
            vehicle_id=vehicle.id,
            user_id=user.id,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            created_at=datetime.now(timezone.utc)
        )
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)

        return PurchaseResponse(
            message='Vehicle purchased successfully',
            purchase_id=purchase.id,
            quantity=purchase.quantity,
            unit_price=purchase.unit_price,
            total_price=purchase.total_price,
            purchased_at=purchase.created_at,
            vehicle=VehicleResponse.model_validate(vehicle)
        )

    def restock_vehicle(self, vehicle_id: int, restock_in: RestockRequest) -> RestockResponse:
        if restock_in.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Restock quantity must be greater than 0'
            )

        vehicle = self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Vehicle with ID {vehicle_id} not found'
            )

        vehicle.quantity += restock_in.quantity
        vehicle.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(vehicle)

        return RestockResponse(
            message='Vehicle restocked successfully',
            added_quantity=restock_in.quantity,
            vehicle=VehicleResponse.model_validate(vehicle)
        )
