from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.services.vehicle_service import VehicleService
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix='/vehicles', tags=['Vehicles'])

@router.post('', response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = VehicleService(db)
    return service.create(vehicle_in)

@router.get('/search', response_model=List[VehicleResponse], status_code=status.HTTP_200_OK)
def search_vehicles(
    make: Optional[str] = Query(None, description='Make to search (case-insensitive)'),
    model: Optional[str] = Query(None, description='Model to search (case-insensitive)'),
    category: Optional[str] = Query(None, description='Category filter (case-insensitive)'),
    min_price: Optional[float] = Query(None, ge=0, description='Minimum price filter'),
    max_price: Optional[float] = Query(None, ge=0, description='Maximum price filter'),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = VehicleService(db)
    return service.search(make, model, category, min_price, max_price)

@router.get('', response_model=List[VehicleResponse], status_code=status.HTTP_200_OK)
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = VehicleService(db)
    return service.list_all()

@router.get('/{id}', response_model=VehicleResponse, status_code=status.HTTP_200_OK)
def get_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = VehicleService(db)
    return service.get_by_id(id)

@router.put('/{id}', response_model=VehicleResponse, status_code=status.HTTP_200_OK)
def update_vehicle(
    id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = VehicleService(db)
    return service.update(id, vehicle_in)

@router.delete('/{id}', status_code=status.HTTP_200_OK)
def delete_vehicle(
    id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    service = VehicleService(db)
    return service.delete(id)
