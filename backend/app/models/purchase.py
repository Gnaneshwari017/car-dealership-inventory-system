from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Purchase(Base):
    __tablename__ = 'purchases'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey('vehicles.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    vehicle = relationship('Vehicle', backref='purchases')
    user = relationship('User', backref='purchases')

    def __repr__(self):
        return f'<Purchase id={self.id} vehicle_id={self.vehicle_id} user_id={self.user_id} qty={self.quantity} total={self.total_price}>'
