# 📊 XML Validator - System Architecture Diagrams

## 1️⃣ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   USER BROWSER                              │
│              (http://localhost:5173)                        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ + JWT Token
                              ▼
        ┌─────────────────────────────────────────┐
        │     REACT FRONTEND (Vite Build)        │
        ├─────────────────────────────────────────┤
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │      React Router                │  │
        │  │  - /dashboard                    │  │
        │  │  - /validate-xml                 │  │
        │  │  - /history                      │  │
        │  │  - /login, /register             │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │   State Management (Zustand)    │  │
        │  │  - Auth Store                   │  │
        │  │  - Tokens in localStorage       │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  Data Fetching (React Query)     │  │
        │  │  - Caching                       │  │
        │  │  - Refetching                    │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │   Axios (HTTP Client)            │  │
        │  │  - Interceptors                  │  │
        │  │  - Token Management              │  │
        │  └──────────────────────────────────┘  │
        └────────────────┬────────────────────────┘
                         │
                         │ REST API Calls
                         │ JSON + Multipart
                         ▼
        ┌──────────────────────────────────────────┐
        │      FASTAPI BACKEND                     │
        │    (http://localhost:8000)               │
        ├──────────────────────────────────────────┤
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Main Application (main.py)        │ │
        │  │  - CORS Middleware                 │ │
        │  │  - Exception Handlers              │ │
        │  │  - Route Registration              │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Router (api/router.py)            │ │
        │  │  - /api/v1/users                   │ │
        │  │  - /api/v1/validate                │ │
        │  │  - /api/v1/Agent                   │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Core Modules                      │ │
        │  │  - config.py (Settings)            │ │
        │  │  - security.py (JWT, Passwords)    │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Services (services/)              │ │
        │  │  - XML Validation Logic            │ │
        │  │  - Rule Checking                   │ │
        │  │  - Error Analysis                  │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Schemas (Pydantic)                │ │
        │  │  - Request/Response Models         │ │
        │  │  - Type Validation                 │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Database Layer (SQLAlchemy ORM)   │ │
        │  │  - Models Definition               │ │
        │  │  - Session Management              │ │
        │  │  - Query Building                  │ │
        │  └────────────────────────────────────┘ │
        └────────────────┬─────────────────────────┘
                         │
                         │ SQL Queries
                         │ Connection Pooling
                         ▼
        ┌──────────────────────────────────────────┐
        │      MYSQL DATABASE                      │
        │    (localhost:3306)                      │
        ├──────────────────────────────────────────┤
        │  Database: validator_db                  │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Table: users                      │ │
        │  │  - id, username, email, password   │ │
        │  │  - name, is_active                 │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Table: reports (file_id)          │ │
        │  │  - file_name, is_valid, error_msg │ │
        │  │  - validated_date, file_type      │ │
        │  │  - user_id (FK)                    │ │
        │  └────────────────────────────────────┘ │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │  Table: token_blacklist            │ │
        │  │  - jti (JWT ID)                    │ │
        │  └────────────────────────────────────┘ │
        └──────────────────────────────────────────┘
```

---

## 2️⃣ Authentication Flow

```
USER REGISTRATION
═════════════════════════════════════════════════════════════

Frontend (Register.tsx)
│
├─ Input: email, password, fullName
│
└─→ POST /api/v1/users/
   │
   └─→ Backend (users.py)
      │
      ├─ Validate input (Pydantic)
      ├─ Check if user exists
      ├─ Hash password (bcrypt)
      ├─ Create user record
      ├─ Generate JWT token
      │
      └─→ Database INSERT
         │
         └─ users table

      Return: {access_token, token_type, user}
   │
   └─→ Frontend
      │
      ├─ Store access_token in localStorage
      ├─ Update Zustand auth store
      ├─ Show success message
      │
      └─ Redirect to Login


USER LOGIN
═════════════════════════════════════════════════════════════

Frontend (Login.tsx)
│
├─ Input: email, password
│
└─→ POST /api/v1/users/login
   │
   └─→ Backend (users.py)
      │
      ├─ Find user by username
      ├─ Verify password (bcrypt compare)
      ├─ Generate JWT token
      │
      └─ Return: {access_token, token_type, user}
   │
   └─→ Frontend
      │
      ├─ Store access_token in localStorage
      ├─ Store refresh_token in localStorage
      ├─ Update auth store
      │
      └─ Redirect to Dashboard


PROTECTED API REQUEST
═════════════════════════════════════════════════════════════

Frontend (ValidateXML.tsx)
│
├─ File upload or URL input
│
└─→ POST /api/v1/validate
   │
   ├─ Header: Authorization: Bearer <access_token>
   │
   └─→ Backend (Middleware)
      │
      ├─ Extract token from header
      ├─ Decode JWT
      ├─ Verify signature
      ├─ Check expiration
      │
      └─→ If valid, continue
         │
         └─→ endpoint handler (get_current_user)
            │
            ├─ Process file/URL
            ├─ Validate XML
            ├─ Save to database
            │
            └─ Return: {status, message, data}
   │
   └─→ Frontend
      │
      ├─ Update React Query cache
      ├─ Display results
      │
      └─ Done


TOKEN REFRESH (Automatic)
═════════════════════════════════════════════════════════════

When request returns 401 Unauthorized:
│
├─ Axios interceptor catches error
├─ Extract refresh_token from localStorage
├─ Send refresh token to backend
├─ Backend validates and issues new access_token
├─ Update localStorage with new token
├─ Retry original request with new token
│
└─ Done (User doesn't see this)


TOKEN BLACKLIST (On Logout)
═════════════════════════════════════════════════════════════

Frontend (Logout)
│
└─→ POST /api/v1/users/logout
   │
   ├─ Extract token JTI
   │
   └─→ Backend
      │
      ├─ Add JTI to token_blacklist table
      ├─ Frontend clears localStorage
      │
      └─ Redirect to login
```

---

## 3️⃣ XML Validation Flow

```
FILE UPLOAD VALIDATION
═════════════════════════════════════════════════════════════

Frontend (ValidateXML.tsx)
│
├─ User selects XML file
├─ Optional: Enter required_elements & element_types
│
└─→ POST /api/v1/validate
   │
   ├─ Multipart form data:
   │  ├─ file: [XML content]
   │  ├─ required_elements: ["root", "id"]
   │  └─ element_types: {"id": "int", "price": "float"}
   │
   └─→ Backend (xmlReport.py)
      │
      ├─ Authentication check ✓
      ├─ File format validation (.xml)
      ├─ Read file bytes
      │
      ├─→ Syntax Validation
      │  │
      │  └─ validate_xml_all_errors()
      │     ├─ Parse with lxml
      │     └─ Return: (is_valid, error_msg)
      │
      ├─→ Rules Validation (if provided)
      │  │
      │  └─ validate_xml_with_rules()
      │     ├─ Check required elements
      │     ├─ Validate data types
      │     └─ Return: (is_valid, error_msg)
      │
      ├─ Combine results
      ├─ Create Report record
      │
      └─→ Database INSERT
         │
         └─ reports table
            ├─ file_name
            ├─ is_valid
            ├─ error_msg
            ├─ validated_date
            └─ user_id (from auth)
   │
   └─→ Frontend
      │
      ├─ Display validation result
      ├─ Show success/error message
      ├─ Show detailed errors if any
      │
      └─ Update history


URL VALIDATION
═════════════════════════════════════════════════════════════

Frontend (ValidateXML.tsx)
│
├─ User enters URL
├─ Optional: Enter validation rules
│
└─→ POST /api/v1/validate/url
   │
   ├─ JSON body:
   │  ├─ url: "https://example.com/data.xml"
   │  ├─ required_elements: ["root"]
   │  └─ element_types: {"id": "int"}
   │
   └─→ Backend (xmlReport.py)
      │
      ├─ Authentication check ✓
      ├─ URL format validation
      ├─ Fetch XML from URL (with timeout)
      │
      ├─→ Syntax Validation
      │  └─ validate_xml_from_url()
      │     ├─ HTTP GET request
      │     ├─ Parse response content
      │     └─ Return: (is_valid, error_msg)
      │
      ├─→ Rules Validation (if provided)
      │  └─ validate_xml_with_rules()
      │
      ├─ Create Report record
      │
      └─→ Database INSERT
   │
   └─→ Frontend Display Results
```

---

## 4️⃣ Data Flow: Dashboard Stats

```
Frontend Dashboard.tsx
│
├─ useQuery(['dashboard-metrics'])
│
└─→ GET /api/v1/validate/stats
   │
   └─→ Backend (xmlReport.py)
      │
      ├─ Authentication check ✓
      ├─ Get current user from token
      │
      ├─→ Query Database
      │  │
      │  ├─ COUNT total reports
      │  ├─ SUM valid reports
      │  ├─ FILTER by user_id
      │  ├─ GROUP by date
      │  └─ ORDER by validated_date
      │
      ├─→ Calculate Metrics
      │  ├─ totalValidations = COUNT
      │  ├─ successful = SUM(is_valid=1)
      │  ├─ failed = total - successful
      │  └─ last7Days = GROUP by date
      │
      └─→ Return APIResponse
         │
         ├─ status: "success"
         ├─ data:
         │  ├─ totalValidations: 150
         │  ├─ successful: 140
         │  ├─ failed: 10
         │  ├─ avgTimeMs: 743
         │  ├─ last7Days: [
         │  │  {day: "Mon", total: 20, successful: 19, failed: 1},
         │  │  ...
         │  ]
         │  └─ period: {month: "Feb 2026", weekRange: "..."}
         │
         └─ message: "Statistics retrieved successfully"
   │
   └─→ Frontend
      │
      ├─ React Query caches response
      ├─ ParseMetrics from response
      ├─ Render Dashboard Cards
      │  ├─ Total Validations Card
      │  ├─ Successful Card
      │  ├─ Failed Card
      │  ├─ Avg Time Card
      │
      ├─ Render Trend Line Chart
      │  └─ Data from last7Days
      │
      └─ Render Pie Chart
         └─ Successful vs Failed
```

---

## 5️⃣ Component Hierarchy

```
App.tsx
│
├─ Layout.tsx
│  ├─ Header.tsx
│  │  ├─ Logo
│  │  ├─ Navigation
│  │  └─ User Menu
│  │
│  ├─ Sidebar.tsx
│  │  ├─ Dashboard
│  │  ├─ Validate XML
│  │  ├─ Validation History
│  │  ├─ Profile
│  │  └─ Logout
│  │
│  └─ Main Content Area
│     ├─ Dashboard.tsx
│     │  ├─ Stats Cards
│     │  │  ├─ Total Validations
│     │  │  ├─ Successful
│     │  │  ├─ Failed
│     │  │  └─ Avg Time
│     │  │
│     │  ├─ Line Chart (Trends)
│     │  └─ Pie Chart (Success/Failed)
│     │
│     ├─ ValidateXML.tsx
│     │  ├─ Tab: File Upload
│     │  │  ├─ File Input
│     │  │  ├─ Optional Rules
│     │  │  ├─ Submit Button
│     │  │  └─ Results Display
│     │  │
│     │  └─ Tab: URL Validation
│     │     ├─ URL Input
│     │     ├─ Optional Rules
│     │     ├─ Submit Button
│     │     └─ Results Display
│     │
│     ├─ ValidationHistory.tsx
│     │  ├─ Filters
│     │  │  ├─ Search
│     │  │  └─ Status Filter
│     │  │
│     │  ├─ Data Table
│     │  │  ├─ Status
│     │  │  ├─ Type
│     │  │  ├─ Source
│     │  │  ├─ Date
│     │  │  └─ Actions
│     │  │
│     │  └─ Pagination
│     │
│     ├─ Login.tsx
│     │  ├─ Email Input
│     │  ├─ Password Input
│     │  ├─ Sign In Button
│     │  └─ Register Link
│     │
│     ├─ Register.tsx
│     │  ├─ Full Name Input
│     │  ├─ Email Input
│     │  ├─ Password Input
│     │  ├─ Register Button
│     │  └─ Login Link
│     │
│     └─ Profile.tsx
│        ├─ User Info
│        ├─ Edit Profile
│        ├─ Change Password
│        └─ Logout Button
│
├─ Stores
│  └─ authStore.ts (Zustand)
│     ├─ user
│     ├─ isAuthenticated
│     ├─ setUser()
│     └─ logout()
│
└─ Services
   ├─ api.ts (Axios)
   │  ├─ authAPI
   │  ├─ validationAPI
   │  ├─ analyticsAPI
   │  └─ userAPI
   │
   └─ UI Components
      ├─ Button.tsx
      ├─ Card.tsx
      └─ Input.tsx
```

---

## 6️⃣ Database Schema

```
Database: validator_db

┌─────────────────────────────────────────────────┐
│  users                                          │
├─────────────────────────────────────────────────┤
│ id (PK)             INT AUTO_INCREMENT          │
│ username            VARCHAR(255) UNIQUE        │
│ email               VARCHAR(255) UNIQUE        │
│ password            VARCHAR(255)               │
│ name                VARCHAR(255)               │
│ is_active           BOOLEAN DEFAULT TRUE       │
│ created_at          TIMESTAMP                  │
│ updated_at          TIMESTAMP                  │
└─────────────────────────────────────────────────┘
         │
         │ (1:N)
         │
         ▼
┌─────────────────────────────────────────────────┐
│  reports (file_id)                              │
├─────────────────────────────────────────────────┤
│ file_id (PK)        INT AUTO_INCREMENT          │
│ user_id (FK)        INT (references users.id)  │
│ file_name           VARCHAR(255)               │
│ is_valid            BOOLEAN                    │
│ error_msg           LONGTEXT NULLABLE          │
│ validated_date      DATE                       │
│ file_type           VARCHAR(50)                │
│ created_at          TIMESTAMP                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  token_blacklist                                │
├─────────────────────────────────────────────────┤
│ id (PK)             INT AUTO_INCREMENT          │
│ jti                 VARCHAR(255)               │
│ created_at          TIMESTAMP                  │
└─────────────────────────────────────────────────┘
```

---

## 7️⃣ Error Handling Flow

```
Frontend
│
├─ API Call (Axios)
│
└─→ Network/Response Error
   │
   ├─ Axios Interceptor catches
   │
   ├─→ If 401 Unauthorized
   │  │
   │  └─ Attempt Token Refresh
   │     ├─ If refresh successful
   │     │  └─ Retry original request
   │     │
   │     └─ If refresh fails
   │        ├─ Clear localStorage
   │        ├─ Clear auth store
   │        └─ Redirect to /login
   │
   ├─→ If 4xx (Client Error)
   │  │
   │  └─ Display error message
   │     ├─ Show error detail from response
   │     ├─ Suggest user action
   │     └─ Keep user on same page
   │
   ├─→ If 5xx (Server Error)
   │  │
   │  └─ Display generic error
   │     ├─ Log to console
   │     ├─ Show retry button
   │     └─ Suggest checking backend
   │
   └─→ If Network Error
      │
      └─ Display offline message
         ├─ Suggest checking connection
         └─ Provide retry option
```

---

**All diagrams created: ✅ COMPLETE**

Use these diagrams for:
- Understanding system flow
- Onboarding new developers
- Planning improvements
- Debugging issues
- Documentation
