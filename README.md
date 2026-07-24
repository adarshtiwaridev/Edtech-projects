# JP EdTech - Scalable Production Monorepo

Welcome to the **JP EdTech** monorepo repository. This repository has been structured into three independent, production-grade micro-applications.

```text
JP-EdTech/
│
├── backend/        # Express/Node.js REST API
├── frontend/       # React/Vite Student & Teacher Web Application
└── admin/          # React/Vite Dedicated Admin Portal
```

---

## Workspace Structure

| Directory | Type | Port | Purpose |
| :--- | :--- | :--- | :--- |
| [`backend/`](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/backend) | Node.js Express API | `5000` | DB, Auth, Payments, Courses & Admin REST API |
| [`frontend/`](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/frontend) | React / Vite | `5173` | Student learning platform & Teacher portal |
| [`admin/`](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/admin) | React / Vite | `5174` | Dedicated Admin Portal & Management Dashboard |

---

## Quick Start (Local Development)

### 1. Backend Service
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Application (Student & Teacher)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Admin Application
```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

### Or run from Monorepo Root:
```bash
# Start backend
npm run dev:backend

# Start frontend
npm run dev:frontend

# Start admin
npm run dev:admin
```

---

## Deployment Strategy

Each project can be deployed completely independently without affecting the others:

1. **Backend**: Deploy on **Render**, **Railway**, **AWS**, or **DigitalOcean** (`cd backend`, run `npm start`).
2. **Frontend**: Deploy on **Vercel** or **Netlify** (`cd frontend`, set Root Directory to `frontend`, output `dist`).
3. **Admin**: Deploy on **Vercel** or **Netlify** (`cd admin`, set Root Directory to `admin`, output `dist`).
