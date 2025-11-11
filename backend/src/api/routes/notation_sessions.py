"""Notation session routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from ...core.auth import get_current_user
from ...core.database import get_db
from ...models.user import User
from ...schemas.session import NotationSessionCreate, NotationSessionResponse
from ...repositories import notation_session_repository

router = APIRouter(prefix="/notation-sessions", tags=["notation-sessions"])


@router.post("", response_model=NotationSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_notation_session(
    session_data: NotationSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> NotationSessionResponse:
    """Create a new notation training session."""
    session = notation_session_repository.create_notation_session(
        db, current_user.id, session_data
    )
    return session


@router.get("", response_model=List[NotationSessionResponse])
async def get_user_notation_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    drill_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[NotationSessionResponse]:
    """Get all notation sessions for current user."""
    sessions = notation_session_repository.get_user_notation_sessions(
        db, current_user.id, skip=skip, limit=limit, drill_type=drill_type
    )
    return sessions

