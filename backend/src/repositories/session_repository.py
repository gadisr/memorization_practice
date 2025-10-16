"""Session repository for data access."""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from ..models.session import Session as SessionModel
from ..schemas.session import SessionCreate


def create_session(db: Session, user_id: UUID, session_data: SessionCreate) -> SessionModel:
    """Create a new training session."""
    session = SessionModel(
        user_id=user_id,
        **session_data.model_dump()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session_by_id(db: Session, session_id: UUID) -> Optional[SessionModel]:
    """Get session by ID."""
    return db.query(SessionModel).filter(SessionModel.id == session_id).first()


def get_user_sessions(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
    drill_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[SessionModel]:
    """Get all sessions for a user with optional filters."""
    query = db.query(SessionModel).filter(SessionModel.user_id == user_id)
    
    if drill_type:
        query = query.filter(SessionModel.drill_type == drill_type)
    
    if start_date:
        query = query.filter(SessionModel.session_date >= start_date)
    
    if end_date:
        query = query.filter(SessionModel.session_date <= end_date)
    
    return query.order_by(SessionModel.session_date.desc()).offset(skip).limit(limit).all()


def delete_session(db: Session, session_id: UUID) -> None:
    """Delete a session."""
    session = get_session_by_id(db, session_id)
    if session:
        db.delete(session)
        db.commit()

