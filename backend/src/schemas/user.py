"""User schemas for validation."""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    
    firebase_uid: str
    email: EmailStr
    display_name: Optional[str] = None
    profile_picture_url: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    
    display_name: Optional[str] = None
    profile_picture_url: Optional[str] = None


class UserResponse(BaseModel):
    """Schema for user response."""
    
    id: UUID
    firebase_uid: str
    email: str
    display_name: Optional[str]
    profile_picture_url: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True

