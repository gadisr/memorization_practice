"""Authentication middleware and dependencies."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .firebase import verify_firebase_token
from .database import get_db
from ..models.user import User
from typing import Optional
from datetime import datetime

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate Firebase token, return current user."""
    try:
        # Verify Firebase token
        token = credentials.credentials
        decoded_token = await verify_firebase_token(token)
        firebase_uid = decoded_token['uid']
        
        # Get or create user
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            # Create new user from Firebase claims
            user = User(
                firebase_uid=firebase_uid,
                email=decoded_token.get('email'),
                display_name=decoded_token.get('name'),
                profile_picture_url=decoded_token.get('picture')
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        return user
    except HTTPException:
        # Re-raise HTTP exceptions (like 403)
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

