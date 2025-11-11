"""Application configuration settings."""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, List


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
    def parse_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from comma-separated string or return default list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

