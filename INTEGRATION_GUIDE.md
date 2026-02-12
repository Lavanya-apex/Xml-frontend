# Local Integration Setup Guide

This guide helps you set up and run the XML Validator project locally with frontend, backend, and validation scripts integrated.

## 📋 Prerequisites
- Python 3.10+ (for backend)
- Node.js 18+ (for frontend)
- MySQL 8.0+ (for database)
- PowerShell or Command Prompt

## 🗄️ Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE validator_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Verify Backend `.env`
File: `backend/.env`
```dotenv
SECRET_KEY=!@#$%12345
DB_USER=root
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=validator_db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🔧 Backend Setup

### 1. Navigate to Backend
```powershell
cd backend
```

### 2. Create Virtual Environment
```powershell
python -m venv venv
& .\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Initialize Database (Alembic)
```powershell
alembic upgrade head
```

### 5. Run Backend Server
```powershell
uvicorn app.main:app --reload --port 8000
```

✅ Backend should be running at: **http://localhost:8000**
📚 API Docs: **http://localhost:8000/api/v1/openapi.json**

## 🎨 Frontend Setup

### 1. Navigate to Frontend
```powershell
cd frontend
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Verify `.env` File
File: `frontend/.env`
```dotenv
VITE_API_URL=http://localhost:8000
```

### 4. Run Development Server
```powershell
npm run dev
```

✅ Frontend should be running at: **http://localhost:5173**

## 🧪 Testing

### Backend Unit Tests
```powershell
cd backend
$env:PYTHONPATH = "C:\Users\lavanyat\Desktop\Validatior\backend"
pytest -v
```

### Frontend Tests
```powershell
cd frontend
npm run test
```

## 📁 Project Structure Overview

```
Validatior/
├── backend/                    # FastAPI server
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── core/              # Config, security
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   └── alembic/               # Database migrations
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/             # React pages
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API calls
│   │   ├── store/             # Zustand state
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── .env
│
└── pythonDataValidationScipts/
    ├── pythonScripts/         # Validation utilities
    └── tests/                 # Data validation tests
```

## 🔑 Authentication Flow

1. **Register**: User creates account via `/api/v1/users/` → JWT token returned
2. **Login**: User logs in via `/api/v1/users/login` → JWT token returned
3. **Token Storage**: Frontend stores `access_token` in `localStorage`
4. **Requests**: All API calls include `Authorization: Bearer <token>`
5. **Token Refresh**: If token expires (401), refresh automatically (interceptor handles it)

## ✅ API Endpoints

### Authentication
- `POST /api/v1/users/` - Register
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/logout` - Logout (requires auth)
- `GET /api/v1/users/iam` - Get current user (requires auth)

### Validation
- `POST /api/v1/validate` - Validate XML file (requires auth)
- `POST /api/v1/validate/url` - Validate XML from URL (requires auth)
- `GET /api/v1/validate` - Get validation history (requires auth)
- `GET /api/v1/validate/stats` - Get validation statistics (requires auth)

### Agent Routes
- `POST /api/v1/Agent/validate` - Agent validation endpoint

## 🚀 Features Integrated

✅ **File Upload Validation**
- Upload XML files with optional rule validation
- Check for required elements and data types

✅ **URL Validation**
- Validate XML from remote URLs
- Same rule checking as file upload

✅ **Authentication**
- Secure JWT-based auth
- User registration and login
- Token expiration handling

✅ **Dashboard**
- Validation statistics
- Last 7 days trend data
- Success/failure metrics

✅ **Validation History**
- View all past validations
- Filter by status
- Detailed error messages

## 🔧 Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
SECRET_KEY=your-secret-key
DB_USER=root
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=validator_db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🐛 Troubleshooting

### Issue: "Connection refused" on backend startup
**Solution**: Ensure MySQL is running and credentials in `.env` are correct
```powershell
# Test MySQL connection
mysql -u root -p
```

### Issue: "Module not found" errors in backend
**Solution**: Ensure virtual environment is activated
```powershell
& .\venv\Scripts\Activate.ps1
```

### Issue: Frontend shows "API connection failed"
**Solution**: Check `VITE_API_URL` in `frontend/.env` matches backend port
```
VITE_API_URL=http://localhost:8000
```

### Issue: CORS errors
**Solution**: Backend `config.py` includes frontend origins:
```python
BACKEND_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
```

## 📝 Quick Start Commands

### Terminal 1: Backend
```powershell
cd backend
& .\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```

### Terminal 3: Database (if needed)
```powershell
mysql -u root -p
# Create database if needed
# CREATE DATABASE validator_db;
```

## ✨ Next Steps

1. ✅ Start backend and frontend
2. ✅ Navigate to `http://localhost:5173`
3. ✅ Register a new user
4. ✅ Login
5. ✅ Upload an XML file or validate from URL
6. ✅ View dashboard and validation history

---

**For questions or issues, check the console logs in both frontend and backend terminals.**
