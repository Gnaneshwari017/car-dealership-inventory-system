from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, func
from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = 'USER'
    ADMIN = 'ADMIN'

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole, native_enum=False), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f'<User id={self.id} email={self.email} role={self.role}>'
