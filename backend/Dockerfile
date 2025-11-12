FROM python:3.12-slim

WORKDIR /app

# Install poetry
RUN pip install poetry

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Regenerate lock file if needed and install dependencies
RUN poetry config virtualenvs.create false \
    && poetry lock --no-interaction || true \
    && poetry install --no-interaction --no-ansi --only=main --no-root

# Copy application
COPY . .

# Install application
RUN poetry install --no-interaction --no-ansi --only=main

# Run migrations and start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8000"]

