# JP EdTech - Frontend Web Application (Student & Admin)

React & Vite unified frontend application for the **JP EdTech** platform, incorporating the **Student Portal**, **Instructor Portal**, and **Admin Management Panel** in a single codebase with role-based routing and access control.

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── api/            # Axios HTTP client configuration & interceptors
│   ├── assets/         # Static images, vectors, and brand icons
│   ├── components/     # UI components (Auth, Dashboard, Common, Course, etc.)
│   ├── constants/      # App-wide UI constants
│   ├── context/        # React Context providers (ThemeContext)
│   ├── hooks/          # Custom hooks (useAuth, useTheme)
│   ├── layouts/        # Layout wrappers (MainLayout, DashboardLayout)
│   ├── pages/          # Application views & pages
│   ├── reducers/       # Redux root reducers
│   ├── services/       # API Services (authService, courseService, adminService)
│   ├── slices/         # Redux toolkit state slices (auth, profile, cart, etc.)
│   ├── styles/         # Global Tailwind & CSS stylesheets
│   ├── student/        # Student domain component & page exports
│   ├── admin/          # Admin domain component & page exports
│   ├── shared/         # Shared components (ProtectedRoute, RoleGuard, Navbar)
│   ├── App.jsx         # Main application routes & RoleGuards
│   └── main.jsx        # App entry point
├── package.json
├── .env.example
└── README.md
```

---

## ✨ Features Overview

### 🎓 Student Portal
- Browse & Search Courses
- Course Details & Interactive Lecture Player
- Shopping Cart & Razorpay Payment Integration
- Enrolled Courses & Progress Tracking
- User Profile Settings & Theme Customization

### 👨‍🏫 Teacher / Instructor Portal
- Course Builder (Sections & Subsections Video Upload)
- Instructor Dashboard & Enrolled Student Analytics
- Manage Published & Draft Courses

### 🛡️ Admin Panel
- Dedicated Admin Login (`/admin/login`) & Standard Unified Login (`/login`)
- Role-based Protected Access Control (`RoleGuard`)
- Administrative Dashboard (`/dashboard/admin`)
- Manage Categories, Courses, Teachers, Users, and Quizzes

---

## 🛠️ Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_URL` to point to backend Express server (default: `http://localhost:5000/api`).

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment Instructions

The unified frontend application can be easily deployed on platform hosts like **Vercel**, **Netlify**, or **Cloudflare Pages**:

- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Configure `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID` in your hosting dashboard.
