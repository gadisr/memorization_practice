"""Application configuration settings."""

import json
from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
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
    
    # CORS - Accept as string to avoid pydantic-settings parsing issues
    # Map ALLOWED_ORIGINS env var to this field
    ALLOWED_ORIGINS_STR: Optional[str] = Field(default=None, alias='ALLOWED_ORIGINS')
    
    @field_validator('ALLOWED_ORIGINS_STR', mode='before')
    @classmethod
    def parse_allowed_origins_str(cls, v: Union[str, None]) -> Optional[str]:
        """Parse ALLOWED_ORIGINS_STR, handling quotes and various formats."""
        if v is None:
            return None
        if isinstance(v, str):
            # Strip outer quotes if present
            return v.strip().strip('"').strip("'")
        return v
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Convert ALLOWED_ORIGINS_STR to list of strings."""
        default_origins = [
            "https://blindfoldcubing.com",
            "https://www.blindfoldcubing.com",
            "http://localhost:8000",
            "http://localhost:3000"
        ]
        
        if not self.ALLOWED_ORIGINS_STR:
            return default_origins
        
        value = self.ALLOWED_ORIGINS_STR
        
        # Try JSON first (e.g., '["origin1","origin2"]' or ["origin1","origin2"])
        value_stripped = value.strip()
        if value_stripped.startswith('[') and value_stripped.endswith(']'):
            try:
                parsed = json.loads(value_stripped)
                if isinstance(parsed, list):
                    return [str(origin).strip() for origin in parsed if origin]
            except (json.JSONDecodeError, TypeError):
                pass
        
        # Fall back to comma-separated string
        origins = [origin.strip().strip('"').strip("'") for origin in value.split(',') if origin.strip()]
        return origins if origins else default_origins
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        populate_by_name = True  # Allow both field name and alias


settings = Settings()

