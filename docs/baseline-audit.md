# Kodemates EdTech Platform — Baseline System Audit

**Audit Timestamp:** 2026-08-21  
**Project Workspace:** `Edtech-projects`  
**Primary Stack:** MongoDB Atlas, Express.js, React 18 (Vite), Node.js, JavaScript, REST APIs, Redux Toolkit, Socket.IO, Razorpay, Cloudinary, PDFKit, Zod  

---

## 1. System Baseline Environment & Status

| Environment | Component | Script / Tool | Current Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | Dependencies | `npm install` | ✅ Installed | Node >= 18.0.0, Express 4.21, Mongoose 8.23 |
| **Backend** | Dev Server | `npm run dev` | ✅ Active (Port 5000) | Running on nodemon `src/server.js` |
| **Backend** | Unit Tests | `npm test` | 🟡 3 Passed / 1 Warning | Warning in `createCourse.test.js` due to populate chain mock depth |
| **Frontend** | Dependencies | `npm install` | ✅ Installed | React 18.2, Vite 5.0, Redux Toolkit 1.9, Tailwind 3.4 |
| **Frontend** | Dev Server | `npm run dev` | ✅ Active (Vite) | Running on Vite dev server |
| **Frontend** | Unit Tests | `npm test` | ✅ Passed (1 file, 2 tests)| Vitest `streak.test.jsx` passes in 655ms |
| **Database** | MongoDB Atlas | `connectDB()` | ✅ Connected | DNS fallback active for Windows local network |

---

## 2. Identified Baseline Vulnerabilities & Risks

1. **Exposed Credentials in Repository:** `backend/.env.example:8` contains real MongoDB Atlas credentials with username and password.
2. **Un-authenticated Delete Endpoint:** `backend/src/routes/User.js:44` mounts `DELETE /api/users/deleteAccount` without `auth` middleware.
3. **Unprotected Admin Frontend Routes:** `frontend/src/App.jsx:59-60` mounts `/admin-quiz` and `/admin-quiz-builder` as public routes outside `<ProtectedRoute>` and `<RoleGuard>`.
4. **Mock Populate Depth Mismatch:** `Course.js` controller executes 4 `.populate()` calls, while `createCourse.test.js` mocked only 3, causing a runtime warning.

---

## 3. Baseline Audit Conclusion
The core application functionality is intact and both dev servers start properly. The immediate focus is resolving P0 emergency security issues and fixing mock test warnings before adding automated RBAC tests and production documentation.
