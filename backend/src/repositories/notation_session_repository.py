"""Notation session repository for data access."""

from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from ..models.session import NotationSession
from ..schemas.session import NotationSessionCreate


def create_notation_session(
    db: Session, 
    user_id: UUID, 
    session_data: NotationSessionCreate
) -> NotationSession:
    """Create a new notation training session."""
    session = NotationSession(
        user_id=user_id,
        **session_data.model_dump()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_notation_session_by_id(db: Session, session_id: UUID) -> Optional[NotationSession]:
    """Get notation session by ID."""
    return db.query(NotationSession).filter(NotationSession.id == session_id).first()


def get_user_notation_sessions(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
    drill_type: Optional[str] = None
) -> List[NotationSession]:
    """Get all notation sessions for a user with optional filters."""
    query = db.query(NotationSession).filter(NotationSession.user_id == user_id)
    
    if drill_type:
        query = query.filter(NotationSession.drill_type == drill_type)
    
    return query.order_by(NotationSession.session_date.desc()).offset(skip).limit(limit).all()


def delete_notation_session(db: Session, session_id: UUID) -> None:
    """Delete a notation session."""
    session = get_notation_session_by_id(db, session_id)
    if session:
        db.delete(session)
        db.commit()

