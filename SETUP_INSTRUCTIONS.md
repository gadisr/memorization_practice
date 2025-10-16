# PostgreSQL & Firebase Authentication Setup Instructions

This document provides step-by-step instructions for setting up PostgreSQL persistence and Gmail authentication via Firebase for the BLD Memory Trainer.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Python 3.12+
- Poetry (Python dependency manager)
- Node.js 18+ and npm
- A Google account for Firebase setup

### Install Poetry (if not already installed)

```bash
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc  # or ~/.bashrc
poetry --version  # Verify installation
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `bld-memory-trainer` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Set support email
5. Click **Save**

### 3. Get Firebase Configuration (Frontend)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) to add a web app
4. Register app with nickname: `BLD Trainer Web`
5. Copy the Firebase configuration object

Create `.env` file in project root:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Get Service Account Key (Backend)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `firebase-credentials.json` in `backend/` directory

Create `backend/.env` file:

```bash
DATABASE_URL=postgresql://bld_user:bld_password@localhost:5432/bld_trainer
DB_ECHO=false
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_PATH=/app/firebase-credentials.json
API_V1_PREFIX=/api/v1
PROJECT_NAME=BLD Memory Trainer API
ALLOWED_ORIGINS=["http://localhost:8000","http://localhost:3000"]
```

## 🐘 PostgreSQL Setup with Docker

### 1. Start PostgreSQL Database

```bash
docker-compose up -d postgres
```

This will:
- Start PostgreSQL 15 on port 5432
- Create database `bld_trainer`
- Set up user `bld_user` with password `bld_password`

### 2. Install Backend Dependencies

```bash
cd backend
poetry install
```

### 3. Run Database Migrations

```bash
cd backend
poetry run alembic upgrade head
```

This creates the required tables:
- `users` - User accounts from Firebase
- `sessions` - Training sessions
- `notation_sessions` - Notation drill sessions

## 🚀 Running the Application

### Option 1: Development Mode (Recommended)

**Terminal 1 - Start PostgreSQL:**
```bash
docker-compose up postgres
```

**Terminal 2 - Start Backend API:**
```bash
cd backend
poetry run uvicorn src.main:app --reload --port 8000
```

**Terminal 3 - Start Frontend:**
```bash
npm run dev
```

### Option 2: Full Docker Compose

```bash
docker-compose up -d
```

This starts both PostgreSQL and the backend API.

Then start the frontend separately:
```bash
npm run dev
```

### Option 3: Production Build

Build and run everything:
```bash
docker-compose up --build -d
npm run build
npm run serve
```

## 🔍 Verify Setup

### 1. Check PostgreSQL

```bash
docker exec -it bld_trainer_db psql -U bld_user -d bld_trainer -c "\dt"
```

Should show tables: `users`, `sessions`, `notation_sessions`

### 2. Check Backend API

Visit: http://localhost:8000/health

Should return: `{"status": "healthy"}`

### 3. Check API Documentation

Visit: http://localhost:8000/api/v1/docs

Swagger UI should display all API endpoints.

### 4. Test Authentication

1. Open app at http://localhost:8000/
2. Click "Sign in with Google"
3. Authorize with your Gmail account
4. Check backend logs for user creation
5. Verify user in database:

```bash
docker exec -it bld_trainer_db psql -U bld_user -d bld_trainer -c "SELECT * FROM users;"
```

## 📊 Data Migration

When a user signs in for the first time, their localStorage data will automatically migrate to PostgreSQL.

To manually check migration:
1. Sign in with Google
2. Check browser console for migration logs
3. Verify sessions in database:

```bash
docker exec -it bld_trainer_db psql -U bld_user -d bld_trainer -c "SELECT COUNT(*) FROM sessions;"
```

## 🛠️ Troubleshooting

### Firebase Authentication Errors

**Error:** "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings
- Add `localhost` and your domain to Authorized Domains

### PostgreSQL Connection Issues

**Error:** "Connection refused"
```bash
# Check if container is running
docker ps | grep bld_trainer_db

# Check logs
docker logs bld_trainer_db

# Restart container
docker-compose restart postgres
```

### Backend API Errors

**Error:** "No module named 'firebase_admin'"
```bash
cd backend
poetry install
```

**Error:** "Invalid Firebase credentials"
- Verify `FIREBASE_CREDENTIALS_PATH` in `backend/.env`
- Ensure `firebase-credentials.json` exists
- Check file permissions

### Frontend Build Errors

**Error:** "Cannot find module 'firebase/app'"
```bash
npm install
npm install firebase@^10.7.1
```

## 🔒 Security Notes

1. **Never commit credentials:**
   - `.env` files are in `.gitignore`
   - `firebase-credentials.json` is in `.gitignore`
   
2. **Production deployment:**
   - Use environment variables for all secrets
   - Set `DB_ECHO=false` in production
   - Update `ALLOWED_ORIGINS` for your domain
   - Use HTTPS for Firebase auth redirects

3. **Database security:**
   - Change default password in production
   - Use connection pooling
   - Enable SSL for database connections

## 📝 Useful Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build -d
```

### Database Commands
```bash
# Access PostgreSQL shell
docker exec -it bld_trainer_db psql -U bld_user -d bld_trainer

# Backup database
docker exec bld_trainer_db pg_dump -U bld_user bld_trainer > backup.sql

# Restore database
cat backup.sql | docker exec -i bld_trainer_db psql -U bld_user bld_trainer
```

### Backend Commands
```bash
# Run migrations
poetry run alembic upgrade head

# Create new migration
poetry run alembic revision --autogenerate -m "description"

# Rollback migration
poetry run alembic downgrade -1

# Run tests
poetry run pytest
```

## 🎉 Next Steps

Once setup is complete:

1. **Test the app:**
   - Sign in with Google
   - Complete a training session
   - Verify data in PostgreSQL
   - Sign out and sign in again to verify persistence

2. **Customize:**
   - Update Firebase auth settings
   - Modify database schema if needed
   - Add custom middleware or validation

3. **Deploy:**
   - Set up production database (AWS RDS, Heroku Postgres, etc.)
   - Configure production Firebase settings
   - Deploy backend API (Heroku, Railway, Render, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

