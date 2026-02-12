# 🚀 QUICK START GUIDE

## One-Time Setup (First Time Only)

### 1. Prepare Database
```powershell
mysql -u root -p
CREATE DATABASE validator_db CHARACTER SET utf8mb4;
EXIT;
```

### 2. Run Setup Script
```powershell
cd C:\Users\lavanyat\Desktop\Validatior
powershell -ExecutionPolicy Bypass -File setup.ps1
```

This automatically:
- ✅ Creates Python virtual environment
- ✅ Installs backend dependencies
- ✅ Installs frontend dependencies
- ✅ Verifies configuration files

---

## 🎯 Running the Application (Every Time)

### Open 3 Terminal Windows

#### Terminal 1: Backend
```powershell
cd C:\Users\lavanyat\Desktop\Validatior\backend
& .\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Expected: `Application startup complete`

#### Terminal 2: Frontend
```powershell
cd C:\Users\lavanyat\Desktop\Validatior\frontend
npm run dev
```

Expected: `Local: http://localhost:5173/`

#### Terminal 3: MySQL (Optional - only if not running)
```powershell
mysql -u root -p
# Keep window open while testing
```

---

## 🌐 Access the Application

Once both servers are running:

1. **Frontend**: http://localhost:5173
2. **Backend API Docs**: http://localhost:8000/api/v1/openapi.json
3. **Backend Server**: http://localhost:8000

---

## 👤 Test User Flow

### Create Account
1. Go to http://localhost:5173
2. Click "Register here"
3. Enter details:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Submit

### Login
1. Enter email: `test@example.com`
2. Enter password: `password123`
3. Click "Sign in"

### Validate XML
1. Click "Validate XML" in sidebar
2. Upload XML file OR enter URL
3. View results

### Check Dashboard
1. Click "Dashboard" to see statistics
2. View 7-day trends and validation metrics

---

## 📁 Project Files

```
Validatior/
├── QUICK_START.md           ← You are here
├── INTEGRATION_GUIDE.md     ← Detailed setup guide
├── SETUP_CHECKLIST.md       ← Troubleshooting guide
├── setup.ps1                ← Automated setup script
│
├── backend/
│   ├── app/main.py          ← FastAPI app entry
│   ├── app/api/             ← API routes
│   ├── app/models/          ← Database models
│   ├── requirements.txt      ← Python dependencies
│   └── .env                 ← Backend configuration
│
└── frontend/
    ├── src/pages/           ← React pages
    ├── src/services/api.ts  ← API calls
    ├── package.json         ← NPM dependencies
    └── .env                 ← Frontend configuration
```

---

## ✅ Verification Checklist

Before starting, verify:

- [ ] MySQL is running
- [ ] Backend `.env` has correct DB credentials
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:8000`
- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Ports 8000 (backend) and 5173 (frontend) are free

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Port 8000 already in use" | Run `lsof -i :8000` (Mac/Linux) or find process using `netstat` on Windows |
| "ModuleNotFoundError: app" | Activate venv: `& .\venv\Scripts\Activate.ps1` |
| "Cannot connect to database" | Check MySQL is running and credentials are correct |
| "CORS error" in browser | Ensure `VITE_API_URL=http://localhost:8000` in frontend `.env` |
| "Token expired" error | Press F12 → Clear localStorage → Re-login |

---

## 🎓 Architecture Overview

```
┌─────────────────┐
│  React Frontend │ (http://localhost:5173)
│  - React Router │
│  - Zustand      │
│  - React Query  │
└────────┬────────┘
         │ API Calls (Axios)
         │ Bearer Token Auth
         ▼
┌─────────────────────────────────────┐
│  FastAPI Backend                    │ (http://localhost:8000)
│  - SQLAlchemy ORM                   │
│  - Pydantic Schemas                 │
│  - JWT Authentication               │
│  - XML Validation Services          │
└────────────┬────────────────────────┘
             │ SQL Queries
             ▼
      ┌─────────────┐
      │   MySQL DB  │
      │ validator_db│
      └─────────────┘
```

---

## 🔄 Development Workflow

1. **Make Changes** → Edit source files
2. **Auto-Reload** → Uvicorn/Vite reload automatically
3. **Test** → Use browser dev tools (F12)
4. **Debug** → Check terminal output for errors
5. **Commit** → Git commit changes (exclude .env)

---

## 📝 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI app initialization |
| `backend/app/api/xml/xmlReport.py` | XML validation endpoints |
| `frontend/src/services/api.ts` | Axios API configuration |
| `frontend/src/pages/ValidateXML.tsx` | Validation UI |
| `frontend/src/pages/Dashboard.tsx` | Statistics dashboard |

---

## 🛑 Stopping the Application

In each terminal: Press **CTRL + C**

To restart: Re-run commands above in each terminal

---

## 📞 Quick Support

**Backend won't start?**
```
Check: MySQL running, .env credentials, ports 8000 free
Run: pip install -r requirements.txt
```

**Frontend won't load?**
```
Check: npm installed, VITE_API_URL set
Run: npm install
```

**Can't login?**
```
Check: User registration worked
Run: Press F12 → Network tab → see API response
```

---

## ✨ You're All Set!

The application is now ready. Start the 2-3 terminals and begin validating XML files! 🎉

For detailed information, see:
- **INTEGRATION_GUIDE.md** - Comprehensive setup guide
- **SETUP_CHECKLIST.md** - Troubleshooting guide
- Backend API docs at http://localhost:8000/api/v1/openapi.json
