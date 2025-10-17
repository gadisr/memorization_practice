"""Session schemas for validation."""

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import List, Optional, Dict, Any
from decimal import Decimal


class SessionCreate(BaseModel):
    """Schema for creating a training session."""
    
    session_date: datetime
    drill_type: str
    pair_count: int
    pairs: List[Dict[str, Any]]
    timings: List[float]
    average_time: Decimal
    total_time: Optional[Decimal] = None
    recall_accuracy: Decimal
    vividness: Optional[int] = None
    flow: Optional[int] = None
    notes: Optional[str] = None


class SessionResponse(BaseModel):
    """Schema for session response."""
    
    id: UUID
    user_id: UUID
    session_date: datetime
    drill_type: str
    pair_count: int
    pairs: List[Dict[str, Any]]
    timings: List[float]
    average_time: Decimal
    total_time: Optional[Decimal]
    recall_accuracy: Decimal
    vividness: Optional[int]
    flow: Optional[int]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotationSessionCreate(BaseModel):
    """Schema for creating a notation training session."""
    
    session_date: datetime
    drill_type: str
    attempts: List[Dict[str, Any]]
    total_pieces: int
    correct_count: int
    accuracy: Decimal
    average_time: Decimal
    total_time: Optional[Decimal] = None
    notes: Optional[str] = None


class NotationSessionResponse(BaseModel):
    """Schema for notation session response."""
    
    id: UUID
    user_id: UUID
    session_date: datetime
    drill_type: str
    attempts: List[Dict[str, Any]]
    total_pieces: int
    correct_count: int
    accuracy: Decimal
    average_time: Decimal
    total_time: Optional[Decimal]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

