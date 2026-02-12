# 🔧 Local Integration Setup Checklist

## ✅ Pre-Setup Requirements

- [ ] Python 3.10+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MySQL 8.0+ running (`mysql --version`)
- [ ] Git installed (optional)
- [ ] VS Code installed (optional)

## 📂 Project Structure Verified

```
Validatior/
├── backend/          ✅ FastAPI backend
├── frontend/         ✅ React + Vite frontend
├── pythonDataValidationScipts/ ✅ Validation utilities
├── INTEGRATION_GUIDE.md        ✅ Setup documentation
└── setup.ps1                   ✅ Automated setup script
```

## 🗄️ Database Setup

### Option A: Automated (using MySQL CLI)
```powershell
mysql -u root -p
CREATE DATABASE validator_db CHARACTER SET utf8mb4;
EXIT;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new schema: `validator_db`
3. Apply UTF-8 collation

## 🔑 Environment Files

### Backend `.env`
```dotenv
SECRET_KEY=!@#$%12345
DB_USER=root
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=validator_db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend `.env`
```dotenv
VITE_API_URL=http://localhost:8000
```

## 🚀 Starting the Application

### Terminal 1: Backend Server
```powershell
cd C:\Users\lavanyat\Desktop\Validatior\backend
& .\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete [done]
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Terminal 2: Frontend Dev Server
```powershell
cd C:\Users\lavanyat\Desktop\Validatior\frontend
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 🧪 Testing the Integration

### Step 1: Backend Connectivity
```powershell
# In PowerShell, test if backend is responding
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/openapi.json"
```

### Step 2: Frontend Accessibility
Open browser: `http://localhost:5173`

### Step 3: User Registration
1. Click "Register here"
2. Fill in registration form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: testpass123
3. Click "Register"
4. Should be redirected to login

### Step 4: User Login
1. Enter credentials:
   - Username: test@example.com
   - Password: testpass123
2. Click "Sign in"
3. Should redirect to Dashboard

### Step 5: Validate XML
1. Navigate to "Validate XML" page
2. Upload sample XML file or enter URL
3. View validation results
4. Check Dashboard for updated statistics

## 🔍 Troubleshooting

### Backend Issues

#### Error: "Connection refused" on startup
```
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify .env credentials
type backend\.env
```

#### Error: "ModuleNotFoundError: No module named 'app'"
```powershell
# Ensure virtual environment is activated
& .\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

#### Error: "Database already exists"
```powershell
# Clear and restart
alembic downgrade base
alembic upgrade head
```

### Frontend Issues

#### Error: "Cannot find module '@tanstack/react-query'"
```powershell
cd frontend
npm install
```

#### Error: "VITE_API_URL is undefined"
```
# Check frontend/.env
VITE_API_URL=http://localhost:8000
```

#### Error: "CORS error" on API calls
```
# Backend config already includes localhost:5173
# If still failing, check backend/app/core/config.py
BACKEND_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
```

### General Issues

#### Ports Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace XXXX with PID)
taskkill /PID XXXX /F

# Same for frontend port 5173
netstat -ano | findstr :5173
```

#### Token Expired Error
- Clear localStorage: Press F12 → Application → Storage → Local Storage → Clear
- Re-login with credentials

#### Database Connection Timeout
- Verify MySQL credentials in `.env`
- Check MySQL is running: `mysql -u root -p`
- Test connection: `ping localhost`

## 📊 API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/` | No | Register user |
| POST | `/api/v1/users/login` | No | Login user |
| GET | `/api/v1/users/iam` | Yes | Get current user |
| POST | `/api/v1/users/logout` | Yes | Logout user |

### Validation
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/validate` | Yes | Upload & validate XML file |
| POST | `/api/v1/validate/url` | Yes | Validate XML from URL |
| GET | `/api/v1/validate` | Yes | Get all validations |
| GET | `/api/v1/validate/stats` | Yes | Get validation statistics |

## 🔐 Security Notes

- **Never commit** `.env` files to version control
- **Change** `SECRET_KEY` in production
- **Use strong** passwords for database
- **Enable HTTPS** in production
- **Rotate tokens** regularly

## 📈 Performance Tips

1. **Database**: Create indexes for frequently queried fields
2. **Caching**: Enable query caching for stats
3. **Compression**: Enable gzip in frontend build
4. **Lazy Loading**: Implement code splitting for routes

## 🎯 Next Steps

- [ ] Complete registration and login flow
- [ ] Test XML file upload validation
- [ ] Test URL validation
- [ ] Verify dashboard statistics
- [ ] Review validation history
- [ ] Add custom validation rules
- [ ] Deploy to production

## 📞 Support

For issues:
1. Check console logs (F12 in browser or terminal output)
2. Review INTEGRATION_GUIDE.md
3. Check API documentation at http://localhost:8000/api/v1/openapi.json
4. Review source code comments for specific features

---

**Status**: ✅ Ready for Local Integration

**Last Updated**: Feb 4, 2026
