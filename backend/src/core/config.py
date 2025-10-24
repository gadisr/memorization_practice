"""Application configuration settings."""

from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import field_validator
import json


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
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:8000", "http://localhost:3000"]
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from JSON string, comma-separated string, or return default list."""
        if isinstance(v, str):
            # First try to parse as JSON
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # If JSON parsing fails, try comma-separated string
                if ',' in v:
                    return [origin.strip() for origin in v.split(',') if origin.strip()]
                # If no comma, treat as single origin
                return [v.strip()] if v.strip() else ["http://localhost:8000", "http://localhost:3000"]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

