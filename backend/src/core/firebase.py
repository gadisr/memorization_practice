"""Firebase Admin SDK initialization and utilities."""

import os
import firebase_admin
from firebase_admin import credentials, auth
from .config import settings


def initialize_firebase() -> None:
    """Initialize Firebase Admin SDK."""
    try:
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        else:
            # Use default credentials in production
            cred = credentials.ApplicationDefault()
        
        firebase_admin.initialize_app(cred, {
            'projectId': settings.FIREBASE_PROJECT_ID,
        })
        print("✓ Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"⚠️  Firebase initialization failed: {e}")
        print("⚠️  Authentication will not work until Firebase is configured")
        # Don't raise the exception, allow the app to start without Firebase


async def verify_firebase_token(id_token: str) -> dict:
    """Verify Firebase ID token and return decoded claims."""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid token: {str(e)}")

