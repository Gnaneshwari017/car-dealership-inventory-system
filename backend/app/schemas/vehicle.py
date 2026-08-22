from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class VehicleBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=50, description='Manufacturer make')
    model: str = Field(..., min_length=1, max_length=50, description='Vehicle model name')
    category: str = Field(..., min_length=1, max_length=50, description='Category: Sedan, SUV, Electric, Sports, etc.')
    price: float = Field(..., gt=0, description='Vehicle price (must be > 0)')
    quantity: int = Field(..., ge=0, description='Available inventory quantity (must be >= 0)')

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
