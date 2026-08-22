from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.purchase import Purchase

class PurchaseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, purchase: Purchase) -> Purchase:
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)
        return purchase

    def get_by_id(self, purchase_id: int) -> Optional[Purchase]:
        return self.db.query(Purchase).filter(Purchase.id == purchase_id).first()

    def list_by_user(self, user_id: int) -> List[Purchase]:
        return self.db.query(Purchase).filter(Purchase.user_id == user_id).order_by(Purchase.id.desc()).all()
