"""Stats routes for user and population statistics."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...core.auth import get_current_user
from ...core.database import get_db
from ...models.user import User
from ...schemas.stats import UserStatsResponse, PopulationStatsResponse
from ...repositories import stats_repository

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=UserStatsResponse)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> UserStatsResponse:
    """Get user-specific statistics."""
    stats = stats_repository.get_user_stats(db, current_user.id)
    return UserStatsResponse(**stats)


@router.get("/population", response_model=PopulationStatsResponse)
async def get_population_stats(
    db: Session = Depends(get_db)
) -> PopulationStatsResponse:
    """Get population-wide statistics (aggregate across all users).
    
    Public endpoint - no authentication required. Returns aggregate statistics only - no individual user data.
    This allows unregistered users to see how they compare to the community.
    """
    stats = stats_repository.get_population_stats(db, min_users=1)
    
    if stats is None:
        raise HTTPException(
            status_code=503,
            detail="Population statistics not available. Insufficient data (need at least 1 user)."
        )
    
    return PopulationStatsResponse(**stats)

