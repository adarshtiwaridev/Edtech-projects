# JP EdTech - Production Architecture

Welcome to the **JP EdTech** repository. The platform is refactored into **two independent applications** for modular development, clean separation of concerns, and straightforward deployment.

```text
JP-EdTech/
│
├── backend/          # Express / Node.js REST API Service
└── frontend/         # Unified React / Vite Application (Student + Teacher + Admin)
```

---

## 🏛️ Architecture Overview

| Application | Directory | Type | Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | [`backend/`](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/backend) | Node.js / Express | `5000` | Database, Authentication, Payments, Courses & Admin REST API |
| **Frontend App** | [`frontend/`](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/frontend) | React / Vite | `5173` | Unified Student, Instructor, and Admin Portal |

---

## 🚀 Quick Start (Local Development)

### 1. Backend Service
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Application (Student, Teacher & Admin)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Or run from Monorepo Root:
```bash
# Start Backend only
npm run dev:backend

# Start Frontend only
npm run dev:frontend
```

---

## 🔐 Key Features & Role-Based Access Control

- **Unified Authentication**: Login via `/login` or `/admin/login`. Tokens and session profiles are stored in Redux & LocalStorage.
- **Role-Based Guards**: Protected routes enforced using `<ProtectedRoute>` and `<RoleGuard allowedRoles={[...]} />`.
- **Student Dashboard**: Browse courses, purchase via Razorpay, watch lecture videos, manage profile (`/dashboard/student/*`).
- **Instructor Dashboard**: Create courses, manage section videos and course content (`/dashboard/teacher/*`).
- **Admin Dashboard**: Manage platform categories, courses, teachers, users, and quizzes (`/dashboard/admin/*`).

---

## ☁️ Independent Deployment Strategy

Each application is 100% self-contained with no shared internal package dependencies:

1. **Backend Service**: Deploy on **Render**, **Railway**, **AWS Elastic Beanstalk**, or **DigitalOcean** (`cd backend`, run `npm start`).
2. **Frontend App**: Deploy on **Vercel**, **Netlify**, or **Cloudflare Pages** (`cd frontend`, root `frontend`, output `dist`).
