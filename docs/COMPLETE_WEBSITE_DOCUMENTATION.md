# BLD Memory Trainer - Complete Website Documentation

## 🎯 Overview

The BLD Memory Trainer is a comprehensive web-based training application designed for blindfold cubers to improve their memorization skills. It combines a frontend web application with a backend API, offering both offline and cloud-based training experiences with user authentication, progress tracking, and detailed analytics.

## 🏗️ Architecture

### Frontend (Web Application)
- **Technology**: TypeScript, HTML5, CSS3
- **Deployment**: Static files served via HTTP server
- **Storage**: Browser localStorage (offline) + PostgreSQL (cloud)
- **Authentication**: Firebase Authentication with Google OAuth

### Backend (API Server)
- **Technology**: Python FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Firebase token verification
- **Deployment**: Docker containerization

### Infrastructure
- **Development**: Local Python server or Docker Compose
- **Database**: PostgreSQL 15 with Alembic migrations
- **Authentication**: Firebase project with Gmail OAuth

---

## 🖥️ User Interface & Screens

### 1. Setup Screen (Main Landing)
**Purpose**: Configure and start training sessions

**Features**:
- **Drill Selection**: Dropdown with 8 training modes
- **Pair Count Configuration**: Adjustable number of pairs (1-50)
- **Educational Content**: 
  - ℹ️ Info button for BLD technique introduction
  - 📖 "Learn More" button for drill-specific information
- **Authentication**: Google sign-in integration
- **Quick Actions**: Start session, view dashboard

**Keyboard Shortcuts**: None (focus on setup)

### 2. Session Screen (Active Training)
**Purpose**: Display letter pairs for memorization practice

**Features**:
- **Pair Display**: Large, centered letter pair (e.g., "AB")
- **Progress Counter**: "Pair 1 of 30" indicator
- **Timer**: Automatic timing per pair (hidden from user)
- **Navigation**: "Next" button or Space key
- **Cancel Option**: Exit session with confirmation

**Keyboard Shortcuts**:
- `Space` - Next pair
- `Escape` - Cancel session

### 3. Rating Screen (Session Completion)
**Purpose**: Evaluate performance and save session data

**Features**:
- **Quality Rating**: 
  - Vividness (1-5) for short drills: Blurry → Dim → Clear → Vivid → Crystal
  - Flow (1-3) for long drills: Choppy → Smooth → Seamless
- **Recall Testing**: Text area for entering remembered pairs
- **Validation Feedback**: Real-time accuracy checking with detailed breakdown
- **Notes Section**: Optional observations
- **Session Actions**: Save or discard

**Keyboard Shortcuts**:
- `Enter` - Save session
- `1-5` - Quick quality rating
- `Escape` - Discard session

### 4. Notation Training Screen
**Purpose**: Practice Speffz notation recognition

**Features**:
- **Visual Display**: Colored squares representing cube pieces
  - Edge pieces: 2 squares (top/bottom)
  - Corner pieces: 3 squares (top/left/right)
- **Input Field**: Single letter entry for Speffz notation
- **Timer**: Per-piece timing with live display
- **Feedback**: Immediate correct/incorrect indication
- **Progress**: "Piece 1 of 24" counter

**Keyboard Shortcuts**:
- `Enter` - Submit answer
- `Escape` - Cancel training

### 5. Notation Results Screen
**Purpose**: Review notation training performance

**Features**:
- **Statistics**: Accuracy percentage, average time, total time
- **Attempt Breakdown**: Detailed list of each piece with:
  - Correct/incorrect status
  - User answer vs correct answer
  - Time taken per piece
- **Notes Section**: Optional session observations
- **Actions**: Save results or discard

### 6. Dashboard Screen (Analytics)
**Purpose**: View training progress and statistics

**Features**:
- **Summary Statistics**:
  - Total sessions completed
  - Total pairs practiced
  - Average accuracy percentage
  - Average speed per pair
- **Recent Sessions Table**: Last 10 sessions with:
  - Date, drill type, pair count
  - Average time, total time
  - Accuracy, quality rating
- **Data Management**:
  - Export to CSV functionality
  - Clear all data option
- **Authentication Status**: User profile display

### 7. Info Modal (Educational Content)
**Purpose**: Provide detailed explanations of techniques and drills

**Features**:
- **BLD Technique Introduction**:
  - Explanation of letter-pair memorization
  - Challenge description (20+ pairs in <1 minute)
  - Three key skills: Speed, Story Building, Recall Accuracy
- **Drill-Specific Information**:
  - What each drill does
  - How it contributes to solving blindfold
  - Connection to real BLD scenarios
- **Responsive Design**: Works on desktop and mobile
- **Multiple Close Methods**: X button, footer button, click outside

---

## 🎯 Training Modes & Features

### Core Memorization Drills

#### 1. Flash Pairs
- **Purpose**: Build instant letter-to-image conversion
- **Format**: Single pairs displayed sequentially
- **Pairs**: 30 (default)
- **Metric**: Vividness (1-5)
- **Skill Focus**: Raw visualization speed

#### 2. 2-Pair Fusion
- **Purpose**: Learn image fusion techniques
- **Format**: Two pairs combined into one scene
- **Pairs**: 10 (default)
- **Metric**: Vividness (1-5)
- **Skill Focus**: Connecting separate images

#### 3. 3-Pair Chain
- **Purpose**: Progressive story construction
- **Format**: Three pairs built into continuous narrative
- **Pairs**: 5 (default)
- **Metric**: Vividness (1-5)
- **Skill Focus**: Sequential story building

#### 4. 8-Pair Chain
- **Purpose**: Extended narrative construction
- **Format**: Eight pairs in one continuous story
- **Pairs**: 8 (default)
- **Metric**: Flow (1-3)
- **Skill Focus**: Memory palace location management

#### 5. Journey Mode
- **Purpose**: Multi-location memory palace practice
- **Format**: 15+ pairs across multiple locations
- **Pairs**: 15 (default)
- **Metric**: Flow (1-3)
- **Skill Focus**: Location transitions and organization

#### 6. Full Cube Simulation
- **Purpose**: Complete BLD solve practice
- **Format**: 20+ pairs representing edges + corners
- **Pairs**: 20 (default)
- **Metric**: Flow (1-3)
- **Skill Focus**: All skills combined under pressure

### Notation Training Drills

#### 7. Edge Notation Drill
- **Purpose**: Automatic 2-color piece recognition
- **Format**: Visual edge pieces with single-letter input
- **Pieces**: 24 (all edge orientations)
- **Metric**: Vividness (1-5)
- **Skill Focus**: Speffz notation accuracy and speed

#### 8. Corner Notation Drill
- **Purpose**: Automatic 3-color corner recognition
- **Format**: Visual corner pieces with single-letter input
- **Pieces**: 24 (all corner orientations)
- **Metric**: Vividness (1-5)
- **Skill Focus**: Complex 3-sticker identification

---

## 💾 Data Management

### Local Storage (Offline Mode)
- **Technology**: Browser localStorage
- **Capacity**: ~5-10MB (~25,000 sessions)
- **Keys**: Prefixed with `bld_trainer_`
- **Privacy**: All data stays on device
- **Backup**: CSV export functionality

### Cloud Storage (Online Mode)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy with Alembic migrations
- **Authentication**: Firebase token verification
- **Multi-device**: Sync across devices
- **Backup**: Automatic database backups

### Data Models

#### User Model
```typescript
{
  id: UUID,
  firebase_uid: string,
  email: string,
  display_name: string,
  profile_picture_url: string,
  created_at: timestamp,
  last_login: timestamp,
  is_active: boolean
}
```

#### Session Model
```typescript
{
  id: UUID,
  user_id: UUID,
  session_date: timestamp,
  drill_type: string,
  pair_count: number,
  pairs: JSONB,
  timings: JSONB,
  average_time: decimal,
  recall_accuracy: decimal,
  vividness?: number,
  flow?: number,
  notes?: string
}
```

#### Notation Session Model
```typescript
{
  id: UUID,
  user_id: UUID,
  session_date: timestamp,
  drill_type: string,
  attempts: JSONB,
  total_pieces: number,
  correct_count: number,
  accuracy: decimal,
  average_time: decimal,
  notes?: string
}
```

---

## 🔐 Authentication & Security

### Firebase Authentication
- **Provider**: Google OAuth (Gmail accounts)
- **Token Verification**: JWT validation on backend
- **User Management**: Automatic account creation
- **Security**: Bearer token authentication

### Data Protection
- **Privacy**: No data shared with third parties
- **Encryption**: HTTPS for all communications
- **Access Control**: User-specific data isolation
- **Backup**: Secure database backups

---

## 📊 Analytics & Reporting

### Dashboard Statistics
- **Total Sessions**: Count of all completed sessions
- **Total Pairs**: Sum of all pairs practiced
- **Average Accuracy**: Overall recall accuracy percentage
- **Average Speed**: Mean time per pair across all sessions

### Session History
- **Recent Sessions Table**: Last 10 sessions with full details
- **Drill Type Filtering**: View sessions by training mode
- **Date Range**: Chronological organization
- **Performance Tracking**: Accuracy and speed trends

### Export Functionality
- **CSV Format**: Compatible with Google Sheets
- **Complete Data**: All sessions with metadata
- **Analysis Ready**: Structured for external analysis
- **Privacy Preserved**: User controls all data

---

## 🛠️ Technical Implementation

### Frontend Architecture

#### File Structure
```
src/
├── types.ts                    # TypeScript definitions
├── app.ts                      # Main application controller
├── config/
│   └── drill-config.ts         # Drill configurations
├── data/
│   └── pair-reference.json     # Letter pair library
├── services/
│   ├── session-manager.ts      # Session state management
│   ├── timer.ts               # Timing utilities
│   ├── csv-exporter.ts        # Data export
│   ├── quality-adapter.ts     # Quality metrics
│   ├── pair-generator.ts      # Random pair generation
│   ├── recall-validator.ts    # Recall validation
│   ├── notation-validator.ts  # Notation validation
│   └── storage-adapter.ts     # Data persistence
├── ui/
│   ├── renderer.ts            # UI rendering functions
│   ├── keyboard-handler.ts    # Keyboard shortcuts
│   ├── auth-ui.ts            # Authentication UI
│   └── notation-renderer.ts  # Notation training UI
└── utils/
    └── validators.ts          # Input validation
```

#### Key Services

**Session Manager**: Handles session lifecycle, timing, and state management
**Timer Service**: Precise timing with millisecond accuracy
**Quality Adapter**: Adaptive metrics (Vividness/Flow) based on drill type
**Storage Adapter**: Unified interface for localStorage and API persistence
**CSV Exporter**: Data export with proper escaping and formatting

### Backend Architecture

#### File Structure
```
backend/src/
├── main.py                    # FastAPI application entry
├── core/
│   ├── database.py           # Database configuration
│   ├── auth.py              # Authentication middleware
│   └── firebase.py          # Firebase integration
├── models/
│   ├── user.py              # User model
│   ├── session.py           # Session model
│   └── notation_session.py  # Notation session model
├── schemas/
│   ├── user.py              # User schemas
│   ├── session.py           # Session schemas
│   └── notation_session.py  # Notation session schemas
├── repositories/
│   ├── user_repository.py   # User data access
│   ├── session_repository.py # Session data access
│   └── notation_repository.py # Notation data access
└── api/routes/
    ├── users.py             # User endpoints
    ├── sessions.py          # Session endpoints
    └── notation_sessions.py # Notation endpoints
```

#### API Endpoints

**Authentication**:
- `POST /auth/login` - Firebase token verification
- `GET /users/me` - Current user profile
- `PUT /users/me` - Update user profile

**Sessions**:
- `GET /sessions` - List user sessions
- `POST /sessions` - Create new session
- `GET /sessions/{id}` - Get session details
- `PUT /sessions/{id}` - Update session
- `DELETE /sessions/{id}` - Delete session

**Notation Sessions**:
- `GET /notation-sessions` - List notation sessions
- `POST /notation-sessions` - Create notation session
- `GET /notation-sessions/{id}` - Get notation session
- `PUT /notation-sessions/{id}` - Update notation session
- `DELETE /notation-sessions/{id}` - Delete notation session

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    drill_type VARCHAR(50) NOT NULL,
    pair_count INTEGER NOT NULL,
    pairs JSONB NOT NULL,
    timings JSONB NOT NULL,
    average_time DECIMAL(10, 3) NOT NULL,
    recall_accuracy DECIMAL(5, 2) NOT NULL,
    vividness INTEGER,
    flow INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Notation Sessions Table
```sql
CREATE TABLE notation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    drill_type VARCHAR(50) NOT NULL,
    attempts JSONB NOT NULL,
    total_pieces INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    accuracy DECIMAL(5, 2) NOT NULL,
    average_time DECIMAL(10, 3) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Deployment & Setup

### Development Setup

#### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL 15+
- Firebase project with Google OAuth

#### Frontend Setup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
python serve.py
# OR
npm run serve
```

#### Backend Setup
```bash
# Install dependencies
cd backend
poetry install

# Set up database
alembic upgrade head

# Start development server
uvicorn src.main:app --reload
```

#### Docker Setup
```bash
# Start all services
docker-compose up

# Access application
http://localhost:8000/public/
```

### Production Deployment

#### Frontend
- Static file hosting (Nginx, Apache, CDN)
- HTTPS configuration
- Firebase configuration

#### Backend
- Docker container deployment
- PostgreSQL database
- Environment variable configuration
- SSL certificate setup

---

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Requirements
- ES6 module support
- localStorage API
- Fetch API
- CSS Grid and Flexbox

### Mobile Support
- **Responsive Design**: Optimized for mobile devices
- **Touch Interface**: Touch-friendly controls
- **Performance**: Optimized for mobile browsers
- **Offline Support**: Works without internet connection

---

## 🔧 Configuration

### Environment Variables

#### Frontend
- `FIREBASE_API_KEY`: Firebase project API key
- `FIREBASE_AUTH_DOMAIN`: Firebase authentication domain
- `FIREBASE_PROJECT_ID`: Firebase project ID

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase service account
- `SECRET_KEY`: Application secret key

### Firebase Configuration
```javascript
{
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "your-app-id"
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: #2196F3 (Blue)
- **Secondary**: #FFFFFF (White)
- **Success**: #4CAF50 (Green)
- **Error**: #F44336 (Red)
- **Warning**: #FF9800 (Orange)
- **Text Primary**: #212121 (Dark Gray)
- **Text Secondary**: #757575 (Medium Gray)

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: 600 weight
- **Body**: 400 weight
- **Line Height**: 1.6

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Primary, secondary, text variants
- **Forms**: Clean inputs with validation states
- **Modals**: Overlay with smooth animations
- **Tables**: Responsive with hover states

---

## 🔮 Future Enhancements

### Planned Features
- **Analytics Dashboard**: Charts and visualizations
- **Custom Pair Libraries**: User-defined letter pairs
- **Audio Mode**: Voice-based pair training
- **PWA Support**: Installable mobile app
- **Advanced Statistics**: Detailed performance analysis
- **Community Features**: Leaderboards and sharing

### Technical Improvements
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG compliance
- **Testing**: Automated test suite
- **Monitoring**: Error tracking and analytics
- **Internationalization**: Multi-language support

---

## 📞 Support & Documentation

### User Documentation
- `README.md` - Getting started guide
- `QUICKSTART.md` - 30-second setup
- `docs/USING_INTRODUCTION_FEATURE.md` - Feature usage guide
- `docs/COMPLETE_WEBSITE_DOCUMENTATION.md` - This document

### Developer Documentation
- `DEVELOPMENT.md` - Development workflow
- `docs/features/` - Feature implementation plans
- `docs/INTRODUCTION_FEATURE.md` - Recent feature documentation

### Troubleshooting
- **Common Issues**: Browser compatibility, localStorage limits
- **Performance**: Large session datasets, mobile optimization
- **Authentication**: Firebase configuration, token expiration
- **Data**: Export/import functionality, backup strategies

---

## 📄 License & Credits

### License
MIT License - See LICENSE file for details

### Credits
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Python ORM
- **Firebase**: Authentication and hosting
- **TypeScript**: Type-safe JavaScript development
- **PostgreSQL**: Reliable database system

---

**Status**: ✅ PRODUCTION READY

The BLD Memory Trainer is a comprehensive, feature-rich application ready for both personal training and potential deployment as a public service. All core features are implemented and tested, with a solid foundation for future enhancements.
