import os
from datetime import datetime, timedelta

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

ALGORITHM = "HS256"

oauth2_scheme_admin = OAuth2PasswordBearer(tokenUrl="/admin/login")


def _get_admin_settings():
    username = os.getenv("ADMIN_USERNAME", "")
    password = os.getenv("ADMIN_PASSWORD", "")
    secret = os.getenv("ADMIN_JWT_SECRET") or os.getenv("SECRET_KEY") or "ADMIN_DEV_SECRET"
    expires_minutes = int(os.getenv("ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    return username, password, secret, expires_minutes


def _require_admin_creds_configured():
    username, password, _secret, _expires = _get_admin_settings()
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin credentials are not configured (set ADMIN_USERNAME and ADMIN_PASSWORD in .env)",
        )


def create_admin_token() -> str:
    username, password, secret, expires_minutes = _get_admin_settings()
    if not username or not password:
        _require_admin_creds_configured()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {"sub": username, "role": "admin", "exp": expire}
    return jwt.encode(payload, secret, algorithm=ALGORITHM)


def verify_admin_credentials(username: str, password: str) -> bool:
    expected_username, expected_password, _secret, _expires = _get_admin_settings()
    if not expected_username or not expected_password:
        _require_admin_creds_configured()
    return username == expected_username and password == expected_password


def get_current_admin(token: str = Depends(oauth2_scheme_admin)):
    try:
        _username, _password, secret, _expires = _get_admin_settings()
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
        role = payload.get("role")
        sub = payload.get("sub")
        if role != "admin" or not sub:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token",
            )
        return {"username": sub, "role": role}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin token",
        )
