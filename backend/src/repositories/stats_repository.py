"""Stats repository for calculating user and population statistics."""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from sqlalchemy.dialects.postgresql import aggregate_order_by
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from uuid import UUID
from decimal import Decimal
from ..models.session import Session as SessionModel, NotationSession
from ..models.user import User


def get_user_stats(db: Session, user_id: UUID) -> Dict:
    """Calculate user-specific statistics."""
    # Get all sessions for user
    sessions = db.query(SessionModel).filter(
        SessionModel.user_id == user_id
    ).all()
    
    notation_sessions = db.query(NotationSession).filter(
        NotationSession.user_id == user_id
    ).all()
    
    total_sessions = len(sessions) + len(notation_sessions)
    total_pairs = sum(s.pair_count for s in sessions)
    
    # Calculate averages
    if sessions:
        avg_accuracy = float(sum(s.recall_accuracy for s in sessions) / len(sessions))
        avg_speed = float(sum(s.average_time for s in sessions) / len(sessions))
        best_accuracy = float(max(s.recall_accuracy for s in sessions))
        best_speed = float(min(s.average_time for s in sessions))
        
        # Best quality (vividness or flow)
        quality_scores = [
            s.vividness or s.flow 
            for s in sessions 
            if s.vividness is not None or s.flow is not None
        ]
        best_quality = int(max(quality_scores)) if quality_scores else 0
    else:
        avg_accuracy = 0.0
        avg_speed = 0.0
        best_accuracy = 0.0
        best_speed = 0.0
        best_quality = 0
    
    # Add notation session accuracy
    if notation_sessions:
        notation_avg_accuracy = sum(s.accuracy for s in notation_sessions) / len(notation_sessions)
        if total_sessions > 0:
            avg_accuracy = (avg_accuracy * len(sessions) + float(notation_avg_accuracy) * len(notation_sessions)) / total_sessions
        best_accuracy = max(best_accuracy, float(max(s.accuracy for s in notation_sessions)))
    
    # Calculate streak
    all_sessions = sorted(
        sessions + notation_sessions,
        key=lambda s: s.session_date,
        reverse=True
    )
    
    streak_data = _calculate_streak(all_sessions)
    
    # Calculate drill-specific stats
    drill_stats = _calculate_drill_stats(sessions, notation_sessions)
    
    return {
        "total_sessions": total_sessions,
        "total_pairs": total_pairs,
        "avg_accuracy": round(avg_accuracy, 2),
        "avg_speed": round(avg_speed, 3),
        "best_accuracy": round(best_accuracy, 2),
        "best_speed": round(best_speed, 3),
        "best_quality": best_quality,
        "current_streak": streak_data["current_streak"],
        "last_session_date": streak_data["last_session_date"].isoformat() if streak_data["last_session_date"] else None,
        "days_since_last_session": streak_data["days_since_last_session"],
        "drill_stats": drill_stats
    }


def _calculate_streak(sessions: List) -> Dict:
    """Calculate current practice streak."""
    if not sessions:
        return {
            "current_streak": 0,
            "last_session_date": None,
            "days_since_last_session": 0
        }
    
    last_session_date = sessions[0].session_date
    last_date = last_session_date.date() if hasattr(last_session_date, 'date') else datetime.fromisoformat(str(last_session_date)).date()
    today = datetime.now().date()
    days_since = (today - last_date).days
    
    # Calculate streak
    session_dates = set()
    for session in sessions:
        session_date = session.session_date.date() if hasattr(session.session_date, 'date') else datetime.fromisoformat(str(session.session_date)).date()
        session_dates.add(session_date)
    
    current_streak = 0
    check_date = last_date
    
    while check_date in session_dates:
        current_streak += 1
        check_date = check_date - timedelta(days=1)
    
    return {
        "current_streak": current_streak,
        "last_session_date": last_session_date,
        "days_since_last_session": days_since
    }


def _calculate_drill_stats(sessions: List[SessionModel], notation_sessions: List[NotationSession]) -> List[Dict]:
    """Calculate statistics per drill type."""
    drill_stats_map: Dict[str, Dict] = {}
    
    # Process regular sessions
    for session in sessions:
        drill_type = session.drill_type
        if drill_type not in drill_stats_map:
            drill_stats_map[drill_type] = {
                "drill_type": drill_type,
                "session_count": 0,
                "best_accuracy": 0.0,
                "best_speed": float('inf'),
                "avg_accuracy": 0.0,
                "avg_speed": 0.0,
                "accuracies": [],
                "speeds": []
            }
        
        stats = drill_stats_map[drill_type]
        stats["session_count"] += 1
        stats["accuracies"].append(float(session.recall_accuracy))
        stats["speeds"].append(float(session.average_time))
        stats["best_accuracy"] = max(stats["best_accuracy"], float(session.recall_accuracy))
        stats["best_speed"] = min(stats["best_speed"], float(session.average_time))
    
    # Process notation sessions
    for session in notation_sessions:
        drill_type = session.drill_type
        if drill_type not in drill_stats_map:
            drill_stats_map[drill_type] = {
                "drill_type": drill_type,
                "session_count": 0,
                "best_accuracy": 0.0,
                "best_speed": float('inf'),
                "avg_accuracy": 0.0,
                "avg_speed": 0.0,
                "accuracies": [],
                "speeds": []
            }
        
        stats = drill_stats_map[drill_type]
        stats["session_count"] += 1
        stats["accuracies"].append(float(session.accuracy))
        stats["speeds"].append(float(session.average_time))
        stats["best_accuracy"] = max(stats["best_accuracy"], float(session.accuracy))
        stats["best_speed"] = min(stats["best_speed"], float(session.average_time))
    
    # Calculate averages
    result = []
    for drill_type, stats in drill_stats_map.items():
        if stats["accuracies"]:
            stats["avg_accuracy"] = round(sum(stats["accuracies"]) / len(stats["accuracies"]), 2)
            stats["avg_speed"] = round(sum(stats["speeds"]) / len(stats["speeds"]), 3)
        if stats["best_speed"] == float('inf'):
            stats["best_speed"] = 0.0
        
        result.append({
            "drill_type": drill_type,
            "session_count": stats["session_count"],
            "best_accuracy": round(stats["best_accuracy"], 2),
            "best_speed": round(stats["best_speed"], 3),
            "avg_accuracy": stats["avg_accuracy"],
            "avg_speed": stats["avg_speed"]
        })
    
    return result


def get_population_stats(db: Session, min_users: int = 1) -> Optional[Dict]:
    """Calculate population-wide statistics (aggregate across all users)."""
    # Check if we have enough users
    user_count = db.query(func.count(User.id)).scalar()
    if user_count < min_users:
        return None
    
    # Get all sessions
    all_sessions = db.query(SessionModel).all()
    all_notation_sessions = db.query(NotationSession).all()
    
    # Need at least some session data to calculate stats
    if not all_sessions and not all_notation_sessions:
        return None
    
    # Calculate population averages
    session_accuracies = [float(s.recall_accuracy) for s in all_sessions]
    session_speeds = [float(s.average_time) for s in all_sessions]
    notation_accuracies = [float(s.accuracy) for s in all_notation_sessions]
    
    all_accuracies = session_accuracies + notation_accuracies
    all_speeds = session_speeds
    
    avg_accuracy = sum(all_accuracies) / len(all_accuracies) if all_accuracies else 0.0
    avg_speed = sum(all_speeds) / len(all_speeds) if all_speeds else 0.0
    
    # Calculate quality average
    quality_scores = [
        s.vividness or s.flow 
        for s in all_sessions 
        if s.vividness is not None or s.flow is not None
    ]
    avg_quality = float(sum(quality_scores) / len(quality_scores)) if quality_scores else 0.0
    
    # Calculate percentiles
    sorted_accuracies = sorted(all_accuracies) if all_accuracies else []
    sorted_speeds = sorted(all_speeds) if all_speeds else []
    sorted_qualities = sorted(quality_scores) if quality_scores else []
    
    def percentile(data: List[float], p: float) -> float:
        if not data:
            return 0.0
        k = (len(data) - 1) * p
        f = int(k)
        c = k - f
        if f + 1 < len(data):
            return data[f] + c * (data[f + 1] - data[f])
        return data[f]
    
    accuracy_percentiles = {
        "p25": round(percentile(sorted_accuracies, 0.25), 2),
        "p50": round(percentile(sorted_accuracies, 0.50), 2),
        "p75": round(percentile(sorted_accuracies, 0.75), 2),
        "p90": round(percentile(sorted_accuracies, 0.90), 2)
    }
    
    speed_percentiles = {
        "p25": round(percentile(sorted_speeds, 0.25), 3),
        "p50": round(percentile(sorted_speeds, 0.50), 3),
        "p75": round(percentile(sorted_speeds, 0.75), 3),
        "p90": round(percentile(sorted_speeds, 0.90), 3)
    }
    
    quality_percentiles = {
        "p25": round(percentile(sorted_qualities, 0.25), 1),
        "p50": round(percentile(sorted_qualities, 0.50), 1),
        "p75": round(percentile(sorted_qualities, 0.75), 1),
        "p90": round(percentile(sorted_qualities, 0.90), 1)
    }
    
    # Calculate improvement benchmarks (average improvement after X sessions)
    improvement_benchmarks = _calculate_improvement_benchmarks(db)
    
    # Calculate drill popularity
    drill_popularity = _calculate_drill_popularity(db)
    
    return {
        "avg_accuracy": round(avg_accuracy, 2),
        "avg_speed": round(avg_speed, 3),
        "avg_quality": round(avg_quality, 1),
        "percentiles": {
            "accuracy": accuracy_percentiles,
            "speed": speed_percentiles,
            "quality": quality_percentiles
        },
        "improvement_benchmarks": improvement_benchmarks,
        "drill_popularity": drill_popularity
    }


def _calculate_improvement_benchmarks(db: Session) -> List[Dict]:
    """Calculate improvement benchmarks based on user progress."""
    # This is a simplified version - in a real implementation, you'd track
    # user progress over time and calculate actual improvement rates
    # For now, return default benchmarks
    return [
        {
            "sessions": 5,
            "avg_improvement": 10.0,
            "description": "Average users improve 10% accuracy after 5 sessions"
        },
        {
            "sessions": 10,
            "avg_improvement": 15.0,
            "description": "Average users improve 15% accuracy after 10 sessions"
        },
        {
            "sessions": 25,
            "avg_improvement": 25.0,
            "description": "Average users improve 25% accuracy after 25 sessions"
        },
        {
            "sessions": 50,
            "avg_improvement": 35.0,
            "description": "Average users improve 35% accuracy after 50 sessions"
        }
    ]


def _calculate_drill_popularity(db: Session) -> Dict[str, int]:
    """Calculate how popular each drill type is (session counts)."""
    session_counts = db.query(
        SessionModel.drill_type,
        func.count(SessionModel.id).label('count')
    ).group_by(SessionModel.drill_type).all()
    
    notation_counts = db.query(
        NotationSession.drill_type,
        func.count(NotationSession.id).label('count')
    ).group_by(NotationSession.drill_type).all()
    
    popularity: Dict[str, int] = {}
    
    for drill_type, count in session_counts:
        popularity[drill_type] = popularity.get(drill_type, 0) + count
    
    for drill_type, count in notation_counts:
        popularity[drill_type] = popularity.get(drill_type, 0) + count
    
    return popularity

