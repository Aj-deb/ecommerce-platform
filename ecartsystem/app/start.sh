#!/bin/sh

echo "Running database migrations..."
alembic revision --autogenerate -m "initial schema"
alembic upgrade head

echo "Starting FastAPI..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}