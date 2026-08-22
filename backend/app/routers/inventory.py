from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.inventory import RestockRequest, RestockResponse, PurchaseResponse
from app.services.inventory_service import InventoryService
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix='/vehicles', tags=['Inventory'])

@router.post('/{id}/purchase', response_model=PurchaseResponse, status_code=status.HTTP_200_OK)
def purchase_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InventoryService(db)
    return service.purchase_vehicle(vehicle_id=id, user=current_user, quantity=1)

@router.post('/{id}/restock', response_model=RestockResponse, status_code=status.HTTP_200_OK)
def restock_vehicle(
    id: int,
    restock_in: RestockRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    service = InventoryService(db)
    return service.restock_vehicle(vehicle_id=id, restock_in=restock_in)
