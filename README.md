# Kodemates EdTech — Full-Stack Learning Management System (LMS)

[![Core MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/adarsh2027dev/Edtech-projects)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![React 18](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)

A full-stack, production-hardened Learning Management System (LMS) built with the Core MERN stack (MongoDB, Express.js, React 18, Node.js). Features role-based access control (Student, Instructor, Admin), dual-token JWT authentication with multi-device session management, automated PDF certificate generation, AI-powered PDF quiz extraction, Razorpay payment verification, learning streaks, and analytics dashboards.

---

## 🏛️ System Architecture

```text
User (Student / Instructor / Admin)
              │
              ▼
    React 18 SPA (Vite + Redux Toolkit + Framer Motion)
              │
              ├─ Client Routing: React Router v6 (ProtectedRoute + RoleGuard)
              └─ API Interceptor: Axios (Bearer Token + HTTP-Only Cookies)
              │
              ▼
    Node.js & Express REST API Backend
              │
              ├─ Middleware: Helmet, CORS, MongoSanitize, CookieParser, Express-FileUpload
              ├─ Auth Layer: Dual JWT (Access Token + HTTP-Only Refresh Cookie)
              ├─ Controllers: User, Profile, Course, Quiz, Payment, Admin, Student, Certificate
              └─ Services: AuthService, StudentService, QuizEvaluationService, PdfQuizExtractorService, CertificatePdfService
              │
              ▼
    MongoDB Atlas Database (21 Mongoose Schemas & Aggregations)
```

---

## ✨ Key Technical Features

- 🔐 **Dual-Token JWT Authentication:** Short-lived Bearer access tokens paired with HTTP-Only refresh cookies and active multi-device session tracking (`StudentSession`).
- 🤖 **AI PDF-to-Quiz Extraction Engine:** Local text parsing (`pdf-parse`) and Google Generative AI integration to convert course notes into structured Zod-validated quizzes.
- 📜 **Automated PDF Certificate Verification:** Server-side binary PDF generation using `PDFKit` with unique UUID verification hashes accessible at public verification URLs.
- 🔥 **Daily Learning Streak Engine:** Activity log tracking with streak calculations and recovery mechanisms.
- 📊 **Role-Based Analytics Dashboards:** Platform revenue charts for Admins, course revenue analytics for Instructors, and skill matrices for Students.
- 💳 **Razorpay Payment Integrity:** Server-side HMAC SHA256 signature verification preventing payment tampering.
- 💬 **Community Discussion Forum:** Course-level discussion questions, nested answers, and upvoting system.

---

## 📂 Repository Structure

```text
Edtech-projects/
├── backend/                  # Node.js / Express REST API Service
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Mail setup
│   │   ├── controllers/     # Controller handlers (20 modules)
│   │   ├── middleware/      # Auth, RBAC, RateLimit, ErrorHandler
│   │   ├── models/          # 21 Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic services
│   │   ├── tests/           # Jest unit & integration tests
│   │   ├── app.js           # Express app setup & route mounting
│   │   └── server.js        # HTTP server & graceful shutdown
│   └── package.json
│
├── frontend/                 # React 18 / Vite SPA Application
│   ├── src/
│   │   ├── Components/      # Reusable UI components & Guards
│   │   ├── Pages/           # Student, Teacher, Admin pages
│   │   ├── services/        # Axios API client & endpoints
│   │   ├── slices/          # Redux Toolkit state slices
│   │   └── store/           # Redux store configuration
│   └── package.json
│
└── docs/                     # Production Architecture & Audit Docs
    ├── baseline-audit.md     # Baseline audit report
    ├── api-inventory.md      # API endpoint catalog
    ├── database-model-audit.md # Database schemas & index audit
    ├── architecture.md       # High-level architecture documentation
    ├── security.md           # Application security architecture
    └── api.md                # API specification & examples
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas cluster URI
- Cloudinary & Razorpay API credentials

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run dev
```
*Backend server runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).*

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`.*

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests (Jest)
```bash
cd backend
npm test
```
*Executes unit and RBAC security integration tests (`rbac.test.js`, `createCourse.test.js`, `auth.test.js`).*

### Frontend Component Tests (Vitest)
```bash
cd frontend
npm test
```

---

## 🛡️ Security Implementations
- Server-side RBAC validation on all protected endpoints.
- `express-mongo-sanitize` for NoSQL injection prevention.
- `helmet` security headers & `express-rate-limit` rate limiters.
- Sanitized environment variable configuration without exposed credentials.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
