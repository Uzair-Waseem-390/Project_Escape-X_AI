# 🚀 Project Escape-X AI — Full Setup Guide

> **Mars Return Mission** — An AI-powered gamified STEM learning platform where students (ages 10–16) repair their spacecraft by solving STEM challenges across 5 progressive levels.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Repository Structure](#-repository-structure)
- [Backend Setup](#-backend-setup)
  - [1. Create Virtual Environment](#1-create-virtual-environment)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Generate Fernet Key](#4-generate-fernet-key)
  - [5. PostgreSQL Database Setup](#5-postgresql-database-setup)
  - [6. Run Migrations](#6-run-migrations)
  - [7. Seed Questions](#7-seed-questions)
  - [8. Create Superuser](#8-create-superuser)
  - [9. Start Redis](#9-start-redis)
  - [10. Start Celery Worker](#10-start-celery-worker)
  - [11. Start Django Server](#11-start-django-server)
- [Frontend Setup](#-frontend-setup)
  - [1. Install Node Dependencies](#1-install-node-dependencies)
  - [2. Configure Environment Variables](#2-configure-environment-variables-1)
  - [3. Start Development Server](#3-start-development-server)
- [Running Everything Together](#-running-everything-together)
- [API Reference](#-api-reference)
- [Environment Variables Reference](#-environment-variables-reference)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Credits](#-credits)

---

## 🌌 Project Overview

**Project Escape-X AI** is a story-driven educational game. Students play as an astronaut returning from Mars whose spacecraft suffers 5 critical failures. Each level tasks them with solving 15 randomised STEM questions (Math, Physics, Chemistry, Computer Science, General Knowledge) to repair a system and continue the journey home.

**Story Arc:**
| Level | System Failure | Difficulty |
|-------|---------------|------------|
| 1 | 🟢 Navigation System | Easy |
| 2 | 🟡 Power Distribution | Easy |
| 3 | 🟠 Communication Systems | Medium |
| 4 | 🔴 Life Support | Medium |
| 5 | 🔥 Engine Core & Landing | Hard |

**Core Loop:** 15 questions → 15 min timer → Score ≥ 26/30 to pass → AI help (hints, explanations, YouTube videos) → Subject-wise analytics → AI performance report.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│         React 18 + Vite + Tailwind CSS + Three.js           │
│              http://localhost:5173                          │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JWT Bearer)
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                              │
│            Django REST Framework + SimpleJWT                │
│                  http://localhost:8000                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  users   │  │   game   │  │    ai    │  │   core    │  │
│  │   app    │  │   app    │  │   app    │  │ utilities │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
└──────┬────────────────┬──────────────┬──────────────────────┘
       │                │              │
┌──────▼──────┐  ┌──────▼──────┐  ┌───▼──────────────────────┐
│ PostgreSQL  │  │    Redis    │  │  Celery Worker            │
│  Database   │  │  (Broker)   │  │  - LangGraph AI Agent     │
│  port 5432  │  │  port 6379  │  │  - Analytics Aggregation  │
└─────────────┘  └─────────────┘  │  - Level Report Gen       │
                                  └──────────────────────────-┘
                                             │
                                  ┌──────────▼──────────┐
                                  │   External APIs      │
                                  │  - Gemini 2.5 Flash  │
                                  │  - YouTube Data v3   │
                                  └─────────────────────┘
```

---

## ✅ Prerequisites

Make sure the following are installed on your system before starting:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | https://python.org |
| pip | 23+ | Included with Python |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Included with Node.js |
| PostgreSQL | 14+ | https://postgresql.org |
| Redis | 7+ | https://redis.io |
| Git | Any | https://git-scm.com |

> **Windows users:** Redis does not run natively on Windows. Use [WSL2](https://docs.microsoft.com/en-us/windows/wsl/) or install [Redis for Windows](https://github.com/tporadowski/redis/releases).

---

## 📁 Repository Structure

```
Project-Escape-X-AI/
├── backend/                    ← Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── backend/                ← Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── core/               ← Shared utilities (DRY foundation)
│   │   ├── users/              ← Custom user model + JWT auth
│   │   ├── game/               ← Game sessions, questions, scoring
│   │   └── ai/                 ← LangGraph agent + AI interactions
│   └── scripts/
│       └── generate_fernet_key.py
│
└── frontend/                   ← React + Vite + Tailwind
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── api/                ← Axios service layer
        ├── context/            ← Auth context
        ├── hooks/              ← Custom game/auth hooks
        ├── pages/              ← Route-level pages
        ├── components/         ← UI, layout, game, 3D, cutscenes
        └── styles/             ← Theme tokens
```

---

## 🐍 Backend Setup

Open a terminal and navigate to the `backend/` directory:

```bash
cd Project-Escape-X-AI/backend
```

### 1. Create Virtual Environment

```bash
# Create the virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate

# Windows (Command Prompt):
venv\Scripts\activate.bat

# Windows (PowerShell):
venv\Scripts\Activate.ps1
```

> You should see `(venv)` at the start of your terminal prompt.

---

### 2. Install Dependencies

```bash
uv sync
```

This installs:
- Django, DRF, SimpleJWT
- psycopg2-binary (PostgreSQL adapter)
- Celery + Redis
- cryptography (Fernet encryption)
- google-generativeai (Gemini)
- langgraph + langchain-google-genai
- google-api-python-client (YouTube API)

---

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` in your editor and fill in every value. See the [Environment Variables Reference](#-environment-variables-reference) section for details.

```env
# .env (minimum required to start)

SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=escapex_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://localhost:6379/0

FERNET_KEY=          ← Generate this in step 4
YOUTUBE_API_KEY=     ← Your YouTube Data API v3 key
```

---

### 4. Generate Fernet Key

The Fernet key is used to encrypt each user's Gemini API key in the database. **Generate it once and never change it** (changing it will break all existing encrypted keys).

```bash
uv run scripts/generate_fernet_key.py
```

Output example:
```
Your FERNET_KEY:

dGhpcyBpcyBhIHNhbXBsZSBrZXkgZm9yIGRvY3MhISE=

Copy the value above into your .env file as:
FERNET_KEY=dGhpcyBpcyBhIHNhbXBsZSBrZXkgZm9yIGRvY3MhISE=
```

Paste this value into your `.env` file.

> ⚠️ **Keep this key secret.** If it leaks, all stored Gemini API keys can be decrypted.

---

### 5. PostgreSQL Database Setup

Open a PostgreSQL shell (psql) and create the database and user:

```sql
-- Connect as the postgres superuser
psql -U postgres

-- Create the database
CREATE DATABASE escapex_db;

-- (Optional) Create a dedicated user
CREATE USER escapex_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE escapex_db TO escapex_user;

-- Exit
\q
```

Then update your `.env` file with the correct `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.

> **macOS users with Homebrew:** Start PostgreSQL with `brew services start postgresql@14`  
> **Ubuntu/Debian:** `sudo systemctl start postgresql`  
> **Windows:** Start the PostgreSQL service from Services or pgAdmin

---

### 6. Run Migrations

```bash
uv run manage.py migrate
```

Expected output:
```
Operations to perform:
  Apply all migrations: admin, ai, auth, contenttypes, game, sessions, token_blacklist, users
Running migrations:
  Applying users.0001_initial... OK
  Applying game.0001_initial... OK
  Applying ai.0001_initial... OK
  ...
```

---

### 7. Seed Questions

Load all 250 story-driven questions into the database:

```bash
uv run manage.py seed_questions
```

Expected output:
```
✅ Seeding complete!
   Created : 250 questions
   Skipped : 0 already existed
   Total   : 250
```

> This command is safe to re-run. It uses `get_or_create` so it will never duplicate questions.

**Question breakdown:**
- 5 levels × 5 subjects × 10 questions = **250 total**
- Each session randomly selects 3 per subject = **15 per level**

---

### 8. Create Superuser

Create an admin account to access the Django admin panel at `/admin/`:

```bash
uv run manage.py createsuperuser
```

You will be prompted for:
```
Email: admin@escapex.com
Password: (enter a strong password)
Password (again): (confirm)
```

> **Note:** The custom user model uses **email** instead of username.

---

### 9. Start Redis

Redis is required for Celery (async AI tasks and analytics). Open a **new terminal** and start Redis:

```bash
# macOS (Homebrew):
brew services start redis
# or run directly:
redis-server

# Ubuntu/Debian:
sudo systemctl start redis
# or run directly:
redis-server

# Windows (WSL2):
sudo service redis-server start

# Verify Redis is running:
redis-cli ping
# Should return: PONG
```

---

### 10. Start Celery Worker

Open a **new terminal**, activate the virtual environment, and start the Celery worker:

```bash
cd Project-Escape-X-AI/backend
source venv/bin/activate   # or venv\Scripts\activate on Windows

uv run celery -A backend worker -l info
```

Expected output:
```
[config]
.> app:         backend:0x...
.> transport:   redis://localhost:6379/0
.> results:     redis://localhost:6379/0

[tasks]
  . apps.ai.tasks.run_ai_interaction_task
  . apps.ai.tasks.generate_level_report_task
  . apps.game.tasks.update_analytics_task

[2026-...] celery@hostname ready.
```

> **Windows users:** Celery works on Windows with `CELERY_WORKER_POOL = "solo"` which is already configured in settings. If you encounter issues, add `-P solo` to the command: `celery -A backend worker -l info -P solo`

---

### 11. Start Django Server

Back in your original terminal (with venv active):

```bash
uv run manage.py runserver
```

The API is now available at **http://localhost:8000**

**Verify it's working:**
```bash
curl http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Should return: 401 Unauthorized (confirms the endpoint is live)
```

**Django Admin:** http://localhost:8000/admin/

---

## ⚛️ Frontend Setup

Open a **new terminal** and navigate to the `frontend/` directory:

```bash
cd Project-Escape-X-AI/frontend
```

### 1. Install Node Dependencies

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Three.js, Framer Motion, Axios, and all other frontend dependencies listed in `package.json`.

---

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

> If your backend runs on a different port, update this value accordingly.

---

### 3. Start Development Server

```bash
npm run dev
```

The app is now available at **http://localhost:5173**

---

## 🚦 Running Everything Together

For the full application to work, you need **4 processes running simultaneously**. Open 4 terminal windows/tabs:

| Terminal | Directory | Command | Purpose |
|----------|-----------|---------|---------|
| **T1** | `backend/` | `redis-server` | Message broker for Celery |
| **T2** | `backend/` | `celery -A backend worker -l info` | Async AI + analytics tasks |
| **T3** | `backend/` | `python manage.py runserver` | Django REST API |
| **T4** | `frontend/` | `npm run dev` | React development server |

### Quick Start Script

Save this as `start.sh` (macOS/Linux) in the project root:

```bash
#!/bin/bash
echo "🚀 Starting Project Escape-X AI..."

# Terminal 1: Redis
osascript -e 'tell app "Terminal" to do script "redis-server"'

# Terminal 2: Celery
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && source venv/bin/activate && celery -A backend worker -l info"'

# Terminal 3: Django
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/backend && source venv/bin/activate && python manage.py runserver"'

# Terminal 4: Frontend
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/frontend && npm run dev"'

echo "✅ All services starting..."
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "   Admin:     http://localhost:8000/admin"
```

```bash
chmod +x start.sh
./start.sh
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/`. Protected endpoints require `Authorization: Bearer <access_token>`.

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/token/` | No | Login — returns `access` + `refresh` tokens |
| `POST` | `/auth/token/refresh/` | No | Refresh access token using refresh token |
| `POST` | `/auth/token/blacklist/` | No | Logout — blacklists the refresh token |

### 👤 Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/users/register/` | No | Register new user (validates Gemini API key live) |
| `GET` | `/users/profile/` | Yes | Get current user's profile |
| `PATCH` | `/users/profile/` | Yes | Update profile (name, age, gender) |
| `PATCH` | `/users/gemini-key/` | Yes | Replace stored Gemini API key |

### 🎮 Game

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/game/sessions/` | Yes | List all past sessions |
| `POST` | `/game/sessions/start/` | Yes | Start a new level session (selects 15 random questions) |
| `GET` | `/game/sessions/<id>/` | Yes | Get full session state (questions, score, timers) |
| `POST` | `/game/sessions/<id>/answer/` | Yes | Submit an answer |
| `POST` | `/game/sessions/<id>/complete/` | Yes | Finish the level (triggers analytics) |
| `POST` | `/game/sessions/<id>/timer/` | Yes | Start/stop subject timer |
| `GET` | `/game/progress/` | Yes | Get highest unlocked level |
| `GET` | `/game/analytics/` | Yes | Get per-subject aggregated analytics |

### 🤖 AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/assist/` | Yes | Trigger AI (hint/explanation/wrong_answer) — async |
| `GET` | `/ai/interact/<id>/` | Yes | Poll for AI response result |
| `GET` | `/ai/sessions/<id>/history/` | Yes | Get full chat history for a session |
| `POST` | `/ai/sessions/<id>/report/generate/` | Yes | Generate AI performance report (async) |
| `GET` | `/ai/sessions/<id>/report/` | Yes | Fetch AI performance report |

### Example: Start Session

```bash
POST /api/game/sessions/start/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "level": 1
}
```

Response:
```json
{
  "success": true,
  "message": "Level 1 session started.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "level": 1,
    "score": 0,
    "status": "in_progress",
    "session_questions": [
      {
        "order": 1,
        "subject": "math",
        "question": {
          "id": 12,
          "text": "🚀 The navigation computer needs speed...",
          "option_a": "100 km/h",
          "option_b": "150 km/h",
          "option_c": "200 km/h",
          "option_d": "250 km/h",
          "subject": "math"
        }
      }
    ]
  }
}
```

### Example: Request AI Hint

```bash
POST /api/ai/assist/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "question_order": 1,
  "request_type": "hint",
  "user_message": "I don't understand this question"
}
```

Response (immediately):
```json
{
  "success": true,
  "data": {
    "interaction_id": "661f9500-...",
    "task_id": "abc123",
    "status": "processing"
  }
}
```

Then poll:
```bash
GET /api/ai/interact/661f9500-.../
```

Response when ready:
```json
{
  "success": true,
  "data": {
    "ready": true,
    "hint_text": "Think about the relationship between distance, speed, and time...",
    "explanation_text": "",
    "youtube_title": "",
    "youtube_url": ""
  }
}
```

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SECRET_KEY` | ✅ | Django secret key (50+ random chars) | `django-insecure-abc...xyz` |
| `DEBUG` | ✅ | Debug mode (`True` for dev, `False` for prod) | `True` |
| `ALLOWED_HOSTS` | ✅ | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `DB_NAME` | ✅ | PostgreSQL database name | `escapex_db` |
| `DB_USER` | ✅ | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | ✅ | PostgreSQL password | `yourpassword` |
| `DB_HOST` | ✅ | PostgreSQL host | `localhost` |
| `DB_PORT` | ✅ | PostgreSQL port | `5432` |
| `REDIS_URL` | ✅ | Redis connection URL | `redis://localhost:6379/0` |
| `FERNET_KEY` | ✅ | Fernet encryption key for Gemini API keys | *(generated by script)* |
| `YOUTUBE_API_KEY` | ✅ | YouTube Data API v3 key | `AIzaSy...` |

**How to get a Django SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**How to get a YouTube Data API v3 key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **YouTube Data API v3**
4. Go to **Credentials → Create Credentials → API Key**
5. Paste the key into `YOUTUBE_API_KEY`

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL | `http://localhost:8000/api` |

---

## 📁 Project Structure

### Backend — Full File Tree

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── scripts/
│   └── generate_fernet_key.py          ← Run once to create FERNET_KEY
│
├── backend/                             ← Django project config
│   ├── __init__.py                      ← Loads Celery app on startup
│   ├── settings.py                      ← All settings (reads from .env)
│   ├── urls.py                          ← Root URL config + JWT endpoints
│   ├── celery.py                        ← Celery app definition
│   └── wsgi.py
│
└── apps/
    ├── core/                            ← Shared DRY foundation (no models)
    │   ├── constants.py                 ← Game rules: scores, levels, subjects
    │   ├── encryption.py                ← Fernet encrypt() / decrypt()
    │   ├── exceptions.py                ← Global DRF exception handler
    │   ├── responses.py                 ← success_response() / error_response()
    │   └── test_utils.py                ← Shared test base class + factories
    │
    ├── users/                           ← Custom user model + auth
    │   ├── models.py                    ← User (email-only, Fernet-encrypted key)
    │   ├── validators.py                ← Live Gemini API key validation
    │   ├── serializers.py               ← Register, profile, Gemini key update
    │   ├── views.py                     ← Register, profile, key update views
    │   ├── urls.py
    │   ├── admin.py
    │   ├── apps.py
    │   └── migrations/0001_initial.py
    │
    ├── game/                            ← All gameplay logic
    │   ├── models.py                    ← Question, GameSession, SessionQuestion,
    │   │                                    SubjectTimeLog, UserLevelProgress,
    │   │                                    SubjectAnalytics
    │   ├── engine.py                    ← QuestionEngine: random selection
    │   ├── services.py                  ← GameService: scoring, completion, timers
    │   ├── tasks.py                     ← Celery: async analytics aggregation
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── migrations/0001_initial.py
    │   └── management/commands/
    │       └── seed_questions.py        ← 250 story-driven questions
    │
    └── ai/                              ← LangGraph AI agent
        ├── models.py                    ← AIInteraction (chat history), AIReport
        ├── agent.py                     ← 5-node LangGraph pipeline
        │                                    intent → hint/explanation → youtube → format
        ├── youtube_tool.py              ← YouTube Data API v3 integration
        ├── tasks.py                     ← Celery: async agent + report generation
        ├── serializers.py
        ├── views.py
        ├── urls.py
        ├── admin.py
        ├── apps.py
        └── migrations/0001_initial.py
```

### Frontend — Full File Tree

```
frontend/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.jsx                         ← React entry point
    ├── App.jsx                          ← Root with React Router routes
    ├── index.css                        ← Global styles + CSS variables
    │
    ├── api/                             ← Axios service layer
    │   ├── axios.js                     ← Instance with JWT interceptors + auto-refresh
    │   ├── auth.js                      ← register, login, profile, geminiKey, logout
    │   ├── game.js                      ← sessions, answers, timers, progress, analytics
    │   └── ai.js                        ← assist, interact poll, history, report
    │
    ├── context/
    │   └── AuthContext.jsx              ← Auth state (user, tokens, login/logout)
    │
    ├── hooks/
    │   ├── useAuth.js                   ← Auth context consumer
    │   ├── useGameSession.js            ← Game state + session management
    │   └── useAIPolling.js              ← AI interaction polling (2s interval)
    │
    ├── pages/
    │   ├── LandingPage.jsx              ← Public marketing page
    │   ├── LoginPage.jsx                ← Cadet login
    │   ├── RegisterPage.jsx             ← New cadet registration
    │   ├── Dashboard.jsx                ← Mission control hub
    │   ├── SpaceStation.jsx             ← 3D rotatable spacecraft hub
    │   ├── ProfilePage.jsx              ← Cadet profile management
    │   ├── GeminiKeyPage.jsx            ← Update Gemini API key
    │   ├── LevelIntro.jsx               ← Pre-level animated cutscene
    │   ├── LevelPlayPage.jsx            ← Main gameplay (questions + AI)
    │   ├── LevelSuccess.jsx             ← Level passed cutscene
    │   └── LevelFailure.jsx             ← Level failed cutscene
    │
    ├── components/
    │   ├── ui/
    │   │   ├── UIKit.jsx                ← Button, HUDTag, SectionHeader, StatBadge,
    │   │   │                                CornerBrackets, HUDDivider
    │   │   ├── StarField.jsx            ← Canvas animated star background
    │   │   ├── CrisisTicker.jsx         ← Scrolling red alert ticker
    │   │   └── SkipButton.jsx           ← Cutscene skip button
    │   │
    │   ├── layout/
    │   │   ├── Navbar.jsx               ← Sticky HUD navigation
    │   │   └── Footer.jsx               ← Mission debrief footer
    │   │
    │   ├── sections/                    ← Landing page sections
    │   │   ├── HeroSection.jsx
    │   │   ├── StorySection.jsx
    │   │   ├── HowItWorksSection.jsx
    │   │   ├── LevelsSection.jsx
    │   │   ├── AISection.jsx
    │   │   ├── SubjectsSection.jsx
    │   │   ├── FeaturesSection.jsx
    │   │   ├── AnalyticsCTASections.jsx
    │   │   └── EndingCTASection.jsx
    │   │
    │   ├── cutscenes/                   ← Framer Motion story sequences
    │   │   ├── SceneStateSystem.jsx     ← Reusable cutscene engine
    │   │   ├── Level1Cutscene.jsx       ← Navigation failure story
    │   │   ├── Level2Cutscene.jsx       ← Power failure story
    │   │   ├── Level3Cutscene.jsx       ← Comms failure story
    │   │   ├── Level4Cutscene.jsx       ← Life support failure story
    │   │   ├── Level5Cutscene.jsx       ← Engine failure story
    │   │   ├── Level1FailureScene.jsx
    │   │   ├── Level2FailureScene.jsx
    │   │   ├── Level3FailureScene.jsx
    │   │   ├── Level4FailureScene.jsx
    │   │   ├── Level5FailureScene.jsx
    │   │   └── LevelSuccessScene.jsx    ← Shared success scene
    │   │
    │   ├── game/                        ← Gameplay UI components
    │   │   ├── QuestionPanel.jsx        ← Question text + option buttons
    │   │   ├── TimerBar.jsx             ← 15-minute countdown
    │   │   ├── ScoreDisplay.jsx         ← Animated score counter
    │   │   ├── SubjectIndicator.jsx     ← Current subject + progress
    │   │   ├── OptionButton.jsx         ← Single answer choice
    │   │   ├── AICopilotPanel.jsx       ← AI chat (hint/explain/YouTube)
    │   │   └── SubjectTransition.jsx    ← Between-subject animation
    │   │
    │   ├── station/                     ← 3D Space Station
    │   │   ├── Spaceship3D.jsx          ← Three.js procedural spacecraft
    │   │   ├── DamageMarker.jsx         ← Glowing level markers on ship
    │   │   ├── StationHUD.jsx           ← Overlay HUD on 3D page
    │   │   └── LevelModals.jsx          ← Locked/Start level modals
    │   │
    │   └── dashboard/                   ← Dashboard sub-components
    │       ├── WelcomeBanner.jsx
    │       ├── StatsOverview.jsx
    │       ├── LevelProgressCard.jsx
    │       ├── QuickStartCard.jsx
    │       ├── SubjectRadar.jsx
    │       └── RecentSessions.jsx
    │
    └── styles/
        └── theme.js                     ← Design tokens (colors, fonts, shadows)
```

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Language |
| Django | 4.2 | Web framework |
| Django REST Framework | 3.15 | REST API |
| SimpleJWT | 5.3 | JWT authentication |
| PostgreSQL | 14+ | Primary database |
| Celery | 5.4 | Async task queue |
| Redis | 7+ | Celery message broker |
| LangGraph | 0.2 | AI agent pipeline |
| langchain-google-genai | 2.0 | Gemini LLM integration |
| google-generativeai | 0.8 | Gemini API client |
| google-api-python-client | 2.149 | YouTube Data API v3 |
| cryptography | 43 | Fernet encryption |
| django-environ | 0.11 | `.env` file loading |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 6.4 | Build tool |
| Tailwind CSS | 4.0 | Utility CSS |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Three.js | 0.170 | 3D rendering |
| @react-three/fiber | 8.x | React renderer for Three.js |
| @react-three/drei | 9.x | Three.js helpers |
| Framer Motion | 11.x | Animations + cutscenes |

### AI Pipeline

| Component | Details |
|-----------|---------|
| LLM | Gemini 2.5 Flash Lite (fallback: Gemini 2.5 Flash) |
| Framework | LangGraph (5-node agent graph) |
| Agent Flow | intent → hint OR explanation → youtube → format |
| Chat State | Persistent in PostgreSQL (survives page refresh) |
| Execution | Async via Celery worker |
| YouTube | Google YouTube Data API v3 |

---

## 🔧 Troubleshooting

### Backend Issues

**`ModuleNotFoundError: No module named 'apps'`**
```bash
# Make sure you are running from the backend/ directory
cd backend/
python manage.py runserver
```

**`django.db.utils.OperationalError: could not connect to server`**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql   # Linux
brew services list                  # macOS

# Verify your .env DB credentials match your PostgreSQL setup
psql -U your_db_user -d escapex_db
```

**`redis.exceptions.ConnectionError: Error connecting to Redis`**
```bash
# Check Redis is running
redis-cli ping   # Should return PONG

# Start Redis if not running
redis-server     # or: brew services start redis
```

**`ValueError: Fernet key must be 32 url-safe base64-encoded bytes`**
```bash
# Your FERNET_KEY in .env is invalid. Regenerate it:
python scripts/generate_fernet_key.py
# Paste the new key into .env
```

**Celery task not running / AI not responding**
```bash
# Check Celery worker is running and connected to Redis
celery -A backend inspect active

# Restart the worker
celery -A backend worker -l info
```

**`Gemini API key validation fails on register`**
- Ensure the Gemini API key is valid at https://aistudio.google.com/app/apikey
- The key must have access to the `gemini-2.5-flash-lite` or `gemini-2.5-flash` model
- Check your internet connection — validation makes a live API call

---

### Frontend Issues

**`CORS error` when calling backend API**

In `backend/backend/settings.py`, add:
```python
INSTALLED_APPS = [
    ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",   # ← Must be FIRST
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

Then install: `pip install django-cors-headers`

**`401 Unauthorized` on all requests after login**
- Check that `VITE_API_BASE_URL` in `frontend/.env` matches your backend URL exactly
- Ensure the Axios interceptor is correctly attaching the Bearer token
- Check `localStorage` in browser devtools for `access_token`

**3D Space Station not rendering**
- Ensure `@react-three/fiber`, `@react-three/drei`, and `three` are installed
- Check browser console for WebGL errors — WebGL must be enabled
- Try a different browser (Chrome has the best WebGL support)

**`npm install` fails**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### Backend (Production)

```bash
# 1. Set environment variables for production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# 2. Collect static files
python manage.py collectstatic --noinput

# 3. Run with Gunicorn
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4

# 4. Celery with supervisor (production process manager)
celery -A backend worker -l info --concurrency 2
```

### Frontend (Production)

```bash
# 1. Set production API URL in .env
VITE_API_BASE_URL=https://api.yourdomain.com/api

# 2. Build
npm run build

# Output: frontend/dist/ (static files to serve)
```

### Nginx Configuration

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/escape-x/frontend/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /var/www/escape-x/backend/staticfiles/;
    }
}
```

---

## 👤 Credits

**Developer:** Uzair Waseem

- 🔗 LinkedIn: [linkedin.com/in/uzair-waseem](https://linkedin.com/in/uzair-waseem)
- 🐙 GitHub: [Uzair-Waseem-390](https://github.com/Uzair-Waseem-390)
- 📧 Email: uzairwaseem390@gmail.com

---

## 📄 License

All rights reserved. © 2026 Project Escape-X AI.

---

<div align="center">

**🚀 Good luck, Astronaut. Earth is counting on you. 🌍**

</div>