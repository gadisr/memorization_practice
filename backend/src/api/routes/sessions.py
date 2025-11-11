"""Training session routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from ...core.auth import get_current_user
from ...core.database import get_db
from ...models.user import User
from ...schemas.session import SessionCreate, SessionResponse
from ...repositories import session_repository

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SessionResponse:
    """Create a new training session."""
    session = session_repository.create_session(db, current_user.id, session_data)
    return session


@router.get("", response_model=List[SessionResponse])
async def get_user_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    drill_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[SessionResponse]:
    """Get all sessions for current user with optional filters."""
    sessions = session_repository.get_user_sessions(
        db, 
        current_user.id, 
        skip=skip, 
        limit=limit,
        drill_type=drill_type,
        start_date=start_date,
        end_date=end_date
    )
    return sessions


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SessionResponse:
    """Get specific session by ID."""
    session = session_repository.get_session_by_id(db, session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this session")
    
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a session."""
    session = session_repository.get_session_by_id(db, session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this session")
    
    session_repository.delete_session(db, session_id)

