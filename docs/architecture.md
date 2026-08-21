# Kodemates EdTech Architecture & System Flow

Comprehensive architectural overview of the Kodemates EdTech platform.

---

## High-Level System Flow

```text
Student / Instructor / Admin
              │
              ▼
    React 18 Single Page Application (Vite)
              │
              ├─ Router: React Router v6 (Public, Protected, RoleGuard)
              ├─ State: Redux Toolkit + Redux Persist
              └─ API Client: Axios Interceptors (Bearer Token + HTTP-Only Cookies)
              │
              ▼
    Express.js REST API Server (Node.js)
              │
              ├─ Middleware: Helmet, CORS, MongoSanitize, CookieParser, Express-FileUpload
              ├─ Auth: JWT Access Token + HTTP-Only Refresh Token Cookie
              ├─ Controllers: User, Profile, Course, Quiz, Payment, Admin, Student, Certificate
              └─ Services: AuthService, StudentService, QuizEvaluationService, PdfQuizExtractorService, CertificatePdfService
              │
              ▼
    MongoDB Atlas Database (Mongoose ODM - 21 Schemas)
```

---

## Core Lifecycles

### 1. Dual-Token Authentication Lifecycle
1. **User Signup:** Password hashed using `bcrypt` (10 rounds). Email OTP sent via `nodemailer`.
2. **User Login:** Backend validates credentials, creates a short-lived Access Token (JSON body) and sets an `httpOnly`, `secure`, `sameSite` Refresh Token cookie.
3. **Session Tracking:** Device IP, User-Agent, and OS are recorded in `StudentSession`.
4. **Token Refresh:** Axios interceptor catches HTTP 401 and calls `/api/users/refresh` to obtain a new Access Token seamlessly.

### 2. AI PDF-to-Quiz Extraction Lifecycle
```text
PDF Upload ──► File Validation ──► pdf-parse Extract ──► Generative AI Prompt ──► Zod Schema Validation ──► Quiz Saved
```

### 3. Automated PDF Certificate Generation
1. **Completion Check:** Backend verifies `CourseProgress` reaching 100% completion.
2. **Binary Generation:** `PDFKit` compiles certificate layout with student name, course name, issue date, and unique UUID verification hash.
3. **Public Lookup:** Accessible via `/verify-certificate/:verificationId` publicly without login requirement.
