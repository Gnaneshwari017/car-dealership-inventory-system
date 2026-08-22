from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.vehicle import VehicleResponse

class RestockRequest(BaseModel):
    quantity: int = Field(..., gt=0, description='Quantity to add to vehicle inventory (must be > 0)')

class RestockResponse(BaseModel):
    message: str
    added_quantity: int
    vehicle: VehicleResponse

class PurchaseResponse(BaseModel):
    message: str
    purchase_id: int
    quantity: int
    unit_price: float
    total_price: float
    purchased_at: datetime
    vehicle: VehicleResponse
