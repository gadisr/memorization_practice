"""Session models for training data."""

from sqlalchemy import Column, String, Integer, DECIMAL, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from ..core.database import Base


class Session(Base):
    """Training session model."""
    
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_date = Column(DateTime(timezone=True), nullable=False)
    drill_type = Column(String(50), nullable=False)
    pair_count = Column(Integer, nullable=False)
    pairs = Column(JSONB, nullable=False)
    timings = Column(JSONB, nullable=False)
    average_time = Column(DECIMAL(10, 3), nullable=False)
    total_time = Column(DECIMAL(10, 3))
    recall_accuracy = Column(DECIMAL(5, 2), nullable=False)
    vividness = Column(Integer)
    flow = Column(Integer)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NotationSession(Base):
    """Notation training session model."""
    
    __tablename__ = "notation_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_date = Column(DateTime(timezone=True), nullable=False)
    drill_type = Column(String(50), nullable=False)
    attempts = Column(JSONB, nullable=False)
    total_pieces = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    accuracy = Column(DECIMAL(5, 2), nullable=False)
    average_time = Column(DECIMAL(10, 3), nullable=False)
    total_time = Column(DECIMAL(10, 3))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

