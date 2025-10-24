"""Application configuration settings."""

from pydantic_settings import BaseSettings
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

