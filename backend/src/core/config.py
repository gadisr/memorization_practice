"""Application configuration settings."""

import json
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, List, Union


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Database
    DATABASE_URL: str
    DB_ECHO: bool = False
    
    # Firebase
    FIREBASE_PROJECT_ID: str
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "BLD Memory Trainer API"
    
    # CORS - Production defaults
    ALLOWED_ORIGINS: List[str] = [
        "https://blindfoldcubing.com",
        "https://www.blindfoldcubing.com",
        "http://localhost:8000",  # For development
        "http://localhost:3000"   # For development
    ]
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        """Parse ALLOWED_ORIGINS from comma-separated string, JSON array, or return list."""
        default_origins = [
            "https://blindfoldcubing.com",
            "https://www.blindfoldcubing.com",
            "http://localhost:8000",
            "http://localhost:3000"
        ]
        
        if v is None:
            return default_origins
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try JSON first (e.g., '["origin1","origin2"]')
            v_stripped = v.strip()
            if v_stripped.startswith('[') and v_stripped.endswith(']'):
                try:
                    parsed = json.loads(v_stripped)
                    if isinstance(parsed, list):
                        return parsed
                except json.JSONDecodeError:
                    pass
            # Fall back to comma-separated string
            origins = [origin.strip() for origin in v.split(',') if origin.strip()]
            return origins if origins else default_origins
        return default_origins
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

