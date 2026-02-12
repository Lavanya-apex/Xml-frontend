# 📋 XML Validator - Full Stack Application

A professional XML validation platform built with **React + TypeScript + Vite** (frontend) and **FastAPI** (backend), featuring file upload validation, URL validation, user authentication, and comprehensive analytics.

---

## 🎯 Project Overview

### What This Project Does

✅ **XML File Validation** - Upload and validate XML files for syntax errors and custom rules  
✅ **URL Validation** - Validate XML from remote URLs  
✅ **User Authentication** - Secure JWT-based login/registration  
✅ **Validation History** - Track all validations with timestamps and results  
✅ **Dashboard Analytics** - View statistics, trends, and success rates  
✅ **Custom Rules** - Check for required elements and data types  
✅ **Error Reporting** - Detailed error messages and line numbers  

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- React Query (data fetching)
- Zustand (state management)
- Axios (HTTP client)

**Backend**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- Pydantic (data validation)
- JWT (authentication)
- MySQL (database)
- Uvicorn (ASGI server)

**Database**
- MySQL 8.0+
- Schema: validator_db

---

## 📂 Project Structure

```
Validatior/
│
├── 📖 Documentation
│   ├── QUICK_START.md           ← ⭐ Start here
│   ├── INTEGRATION_GUIDE.md      ← Detailed setup
│   ├── SETUP_CHECKLIST.md        ← Troubleshooting
│   └── README.md                 ← This file
│
├── 🔧 Backend (FastAPI)
│   ├── app/
│   │   ├── main.py              ← FastAPI app
│   │   ├── database.py          ← DB connection
│   │   ├── api/
│   │   │   ├── router.py        ← Route registration
│   │   │   └── xml/
│   │   │       ├── xmlReport.py ← Validation endpoints
│   │   │       ├── users.py     ← Auth endpoints
│   │   │       └── agent_route.py
│   │   ├── models/
│   │   │   ├── users.py         ← User model
│   │   │   └── report.py        ← Report model
│   │   ├── schemas/
│   │   │   ├── xml.py           ← XML schemas
│   │   │   ├── users.py         ← User schemas
│   │   │   └── responses.py     ← Response schemas
│   │   ├── services/
│   │   │   └── xml_service.py   ← Validation logic
│   │   └── core/
│   │       ├── config.py        ← Configuration
│   │       └── security.py      ← JWT/Password
│   ├── alembic/                 ← Database migrations
│   ├── requirements.txt
│   ├── .env                     ← Configuration
│   └── tests/                   ← Unit tests
│
├── 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    ← Statistics & trends
│   │   │   ├── ValidateXML.tsx  ← File/URL validation
│   │   │   ├── ValidationHistory.tsx ← History table
│   │   │   ├── Login.tsx        ← Login form
│   │   │   ├── Register.tsx     ← Registration form
│   │   │   └── Profile.tsx      ← User profile
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Input.tsx
│   │   ├── services/
│   │   │   └── api.ts           ← Axios configuration
│   │   ├── store/
│   │   │   └── authStore.ts     ← Zustand auth store
│   │   ├── types/
│   │   │   └── index.ts         ← TypeScript types
│   │   ├── lib/
│   │   │   └── utils.ts         ← Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env                     ← Configuration
│
├── 🧪 Python Scripts
│   └── pythonDataValidationScipts/
│       ├── pythonScripts/
│       │   ├── xmlValidation.py
│       │   └── src/utils/
│       │       ├── xml_utils.py
│       │       └── logger_utils.py
│       └── tests/
│
└── 🚀 Setup Files
    ├── setup.ps1                ← Automated setup script
    └── docker-compose.yml       ← Optional Docker setup
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### 1. First-Time Setup

```powershell
# Create database
mysql -u root -p
CREATE DATABASE validator_db CHARACTER SET utf8mb4;
EXIT;

# Run setup script (automatic)
cd C:\Users\lavanyat\Desktop\Validatior
powershell -ExecutionPolicy Bypass -File setup.ps1
```

### 2. Start Application (Every Time)

**Terminal 1: Backend**
```powershell
cd backend
& .\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Terminal 2: Frontend**
```powershell
cd frontend
npm run dev
```

### 3. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1/openapi.json

---

## 🔑 Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Register/Login
       ▼
┌─────────────────────────────────────────┐
│ POST /api/v1/users/ (Register)          │
│ POST /api/v1/users/login (Login)        │
└──────────────┬──────────────────────────┘
               │ Returns JWT Token
               ▼
┌────────────────────────────────┐
│ localStorage.access_token      │
└────────────────────────────────┘
       │ Include in Headers
       │ Authorization: Bearer <token>
       ▼
┌────────────────────────────────────────┐
│ Protected API Endpoints                │
│ - POST /api/v1/validate                │
│ - GET /api/v1/validate/stats           │
│ - GET /api/v1/users/iam                │
└────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/` | ❌ | Register new user |
| POST | `/api/v1/users/login` | ❌ | Login user |
| GET | `/api/v1/users/iam` | ✅ | Get current user info |
| POST | `/api/v1/users/logout` | ✅ | Logout user |

### Validation Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/validate` | ✅ | Upload and validate XML file |
| POST | `/api/v1/validate/url` | ✅ | Validate XML from URL |
| GET | `/api/v1/validate` | ✅ | Get all validation history |
| GET | `/api/v1/validate/stats` | ✅ | Get validation statistics |

### Request/Response Examples

#### Register
```bash
POST /api/v1/users/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}

Response:
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
  }
}
```

#### Validate File
```bash
POST /api/v1/validate
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <xml_file>
required_elements: ["root", "id"]
element_types: {"id": "int"}

Response:
{
  "status": "SUCCESS",
  "message": "Valid XML File",
  "data": {
    "file_id": 1,
    "file_name": "data.xml",
    "is_valid": true,
    "error_msg": "None",
    "validated_date": "2026-02-04"
  }
}
```

---

## 🧪 Testing

### Backend Tests
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

---

## 🔧 Configuration

### Backend `.env`
```dotenv
SECRET_KEY=!@#$%12345              # Change in production
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

---

## 📊 Features

### Validation Engine
- ✅ XML syntax validation
- ✅ Required element checking
- ✅ Data type validation (int, float, string, bool)
- ✅ Detailed error reporting
- ✅ Line and column error tracking

### User Interface
- ✅ Clean, responsive design
- ✅ Real-time validation feedback
- ✅ Dark mode (with Tailwind)
- ✅ Mobile-friendly layout
- ✅ Keyboard shortcuts

### Analytics
- ✅ Total validation count
- ✅ Success/failure statistics
- ✅ 7-day trend charts
- ✅ Success rate percentage
- ✅ Average validation time

### Data Management
- ✅ Validation history
- ✅ Filter by status
- ✅ Pagination support
- ✅ Export functionality (prepared)
- ✅ Delete old validations

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt for secure storage  
✅ **CORS Protection** - Restricted to allowed origins  
✅ **SQL Injection Prevention** - SQLAlchemy ORM  
✅ **CSRF Protection** - HTTP-only cookies ready  
✅ **Environment Variables** - No secrets in code  

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```
✓ Check MySQL is running
✓ Verify .env credentials
✓ Reinstall: pip install -r requirements.txt
```

**Frontend shows "API error"**
```
✓ Check backend is running on 8000
✓ Verify VITE_API_URL in .env
✓ Clear browser cache
```

**CORS errors**
```
✓ Backend already configured for localhost:5173
✓ Check browser console for exact error
✓ Verify no typos in .env URLs
```

**Port conflicts**
```powershell
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <pid> /F
```

### Debug Mode

**Backend**: Logs in terminal  
**Frontend**: Press F12 → Console/Network tabs  

---

## 📈 Performance

- Frontend builds with Vite (very fast)
- Backend uses connection pooling
- Database queries optimized with indexes
- API responses cached with React Query
- Assets minified and compressed

---

## 🚢 Deployment

For production deployment:

1. Build frontend: `npm run build`
2. Set production environment variables
3. Enable HTTPS
4. Use strong SECRET_KEY
5. Configure database backups
6. Set up logging/monitoring
7. Use process manager (PM2, systemd)

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [JWT Basics](https://jwt.io/introduction)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

---

## 📝 License

Private Project - 2026

---

## ✨ Key Highlights

🎯 **Production-Ready** - Follows best practices  
🔒 **Secure** - JWT auth, hashed passwords  
📱 **Responsive** - Works on all devices  
⚡ **Fast** - Optimized performance  
📊 **Data-Driven** - Rich analytics  
🧪 **Tested** - Unit tests included  

---

## 🎓 Learning Path

**New to the project?** Start with:
1. Read QUICK_START.md (5 min)
2. Run setup script (5 min)
3. Start backend & frontend (2 min)
4. Test registration/login (5 min)
5. Upload sample XML (5 min)
6. Review Dashboard (2 min)

**Total: ~24 minutes to full working app!**

---

## 📞 Support

Found an issue? Check:
1. SETUP_CHECKLIST.md
2. Terminal output/console logs
3. Backend API docs at localhost:8000/api/v1/openapi.json
4. Source code comments

---

**Status**: ✅ Ready for Local Development

**Last Updated**: February 4, 2026

**Version**: 1.0.0
