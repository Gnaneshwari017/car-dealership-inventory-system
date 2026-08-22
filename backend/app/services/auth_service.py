from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserResponse
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, user_in: UserRegister) -> Token:
        normalized_email = user_in.email.lower().strip()
        existing = self.user_repo.get_by_email(normalized_email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail='Email already registered'
            )

        new_user = User(
            name=user_in.name.strip(),
            email=normalized_email,
            password_hash=hash_password(user_in.password),
            role=user_in.role or UserRole.USER
        )
        created_user = self.user_repo.create(new_user)
        token = create_access_token({
            'sub': created_user.email,
            'role': created_user.role.value,
            'id': created_user.id
        })
        return Token(
            access_token=token,
            token_type='bearer',
            user=UserResponse.model_validate(created_user)
        )

    def login(self, login_in: UserLogin) -> Token:
        normalized_email = login_in.email.lower().strip()
        user = self.user_repo.get_by_email(normalized_email)
        if not user or not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid email or password',
                headers={'WWW-Authenticate': 'Bearer'}
            )

        token = create_access_token({
            'sub': user.email,
            'role': user.role.value,
            'id': user.id
        })
        return Token(
            access_token=token,
            token_type='bearer',
            user=UserResponse.model_validate(user)
        )
