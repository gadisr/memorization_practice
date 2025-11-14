"""Stats schemas for API responses."""

from pydantic import BaseModel
from typing import List, Optional, Dict
from decimal import Decimal


class DrillStatsResponse(BaseModel):
    """Drill-specific statistics."""
    drill_type: str
    session_count: int
    best_accuracy: float
    best_speed: float
    avg_accuracy: float
    avg_speed: float


class UserStatsResponse(BaseModel):
    """User statistics response."""
    total_sessions: int
    total_pairs: int
    avg_accuracy: float
    avg_speed: float
    best_accuracy: float
    best_speed: float
    best_quality: int
    current_streak: int
    last_session_date: Optional[str]
    days_since_last_session: int
    drill_stats: List[DrillStatsResponse]


class PercentileDistribution(BaseModel):
    """Percentile distribution."""
    p25: float
    p50: float
    p75: float
    p90: float


class ImprovementBenchmark(BaseModel):
    """Improvement benchmark."""
    sessions: int
    avg_improvement: float
    description: str


class PopulationStatsResponse(BaseModel):
    """Population statistics response."""
    avg_accuracy: float
    avg_speed: float
    avg_quality: float
    percentiles: Dict[str, PercentileDistribution]
    improvement_benchmarks: List[ImprovementBenchmark]
    drill_popularity: Dict[str, int]





