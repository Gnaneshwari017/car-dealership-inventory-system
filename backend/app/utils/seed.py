from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.vehicle import Vehicle
from app.repositories.user_repository import UserRepository
from app.repositories.vehicle_repository import VehicleRepository

DEMO_USERS = [
    {
        'name': 'Dealership Admin',
        'email': 'admin@dealership.com',
        'password': 'Admin@123',
        'role': UserRole.ADMIN
    },
    {
        'name': 'Standard Buyer',
        'email': 'customer@dealership.com',
        'password': 'Customer@123',
        'role': UserRole.USER
    }
]

DEMO_VEHICLES = [
    {
        'make': 'Toyota',
        'model': 'Camry XSE',
        'category': 'Sedan',
        'price': 28500.00,
        'quantity': 7
    },
    {
        'make': 'Honda',
        'model': 'Civic Touring',
        'category': 'Sedan',
        'price': 25800.00,
        'quantity': 5
    },
    {
        'make': 'Ford',
        'model': 'Mustang GT Premium',
        'category': 'Sports',
        'price': 46500.00,
        'quantity': 3
    },
    {
        'make': 'BMW',
        'model': 'X5 xDrive40i',
        'category': 'SUV',
        'price': 67500.00,
        'quantity': 4
    },
    {
        'make': 'Tesla',
        'model': 'Model 3 Long Range',
        'category': 'Electric',
        'price': 47990.00,
        'quantity': 6
    },
    {
        'make': 'Hyundai',
        'model': 'Creta SX (O)',
        'category': 'SUV',
        'price': 19800.00,
        'quantity': 9
    },
    {
        'make': 'Porsche',
        'model': '911 Carrera S',
        'category': 'Sports',
        'price': 123000.00,
        'quantity': 2
    },
    {
        'make': 'Rivian',
        'model': 'R1T Adventure',
        'category': 'Truck',
        'price': 74800.00,
        'quantity': 3
    },
    {
        'make': 'Mercedes-Benz',
        'model': 'EQS 450+ Sedan',
        'category': 'Electric',
        'price': 104400.00,
        'quantity': 0
    }
]

def seed_database(db: Session = None):
    close_at_end = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_at_end = True

    try:
        user_repo = UserRepository(db)
        for u_data in DEMO_USERS:
            existing = user_repo.get_by_email(u_data['email'])
            if not existing:
                user = User(
                    name=u_data['name'],
                    email=u_data['email'].lower(),
                    password_hash=hash_password(u_data['password']),
                    role=u_data['role']
                )
                user_repo.create(user)

        vehicle_repo = VehicleRepository(db)
        existing_vehicles = vehicle_repo.list_all()
        if len(existing_vehicles) == 0:
            for v_data in DEMO_VEHICLES:
                vehicle = Vehicle(
                    make=v_data['make'],
                    model=v_data['model'],
                    category=v_data['category'],
                    price=v_data['price'],
                    quantity=v_data['quantity']
                )
                vehicle_repo.create(vehicle)
        print('Database successfully seeded with realistic inventory and demo credentials!')
    finally:
        if close_at_end:
            db.close()

if __name__ == '__main__':
    seed_database()
