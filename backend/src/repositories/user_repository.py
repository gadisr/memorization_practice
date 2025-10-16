"""User repository for data access."""

from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate


def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> Optional[User]:
    """Get user by Firebase UID."""
    return db.query(User).filter(User.firebase_uid == firebase_uid).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user."""
    user = User(**user_data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: UUID, user_data: UserUpdate) -> Optional[User]:
    """Update user profile."""
    user = get_user_by_id(db, user_id)
    if user:
        for key, value in user_data.model_dump(exclude_unset=True).items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
    return user

