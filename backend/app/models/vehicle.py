from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, CheckConstraint
from app.core.database import Base

class Vehicle(Base):
    __tablename__ = 'vehicles'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    make = Column(String(50), nullable=False, index=True)
    model = Column(String(50), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint('price > 0', name='check_vehicle_price_positive'),
        CheckConstraint('quantity >= 0', name='check_vehicle_quantity_non_negative'),
    )

    def __repr__(self):
        return f'<Vehicle id={self.id} {self.make} {self.model} ({self.category}) price={self.price} qty={self.quantity}>'
