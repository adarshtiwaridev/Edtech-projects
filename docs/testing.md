# Kodemates EdTech Testing Strategy & Automation Suite

Comprehensive documentation of backend and frontend automated testing strategies.

---

## 1. Backend Testing Suite (Jest + Supertest)

### Executing Backend Tests
```bash
cd backend
npm test
```

### Test Coverage Architecture

| Test Suite File | Domain | Key Test Scenarios | Status |
| :--- | :--- | :--- | :--- |
| `src/tests/auth.test.js` | Authentication | Signup validation, duplicate email prevention, invalid credentials | ✅ Passed |
| `src/tests/createCourse.test.js` | Course Management | Required input validation, default fallbacks, 4-level populate chain handling | ✅ Passed |
| `src/tests/courseCompletion.test.js` | Progress Tracking | Subsection progress calculations, percentage completion | ✅ Passed |
| `src/tests/rbac.test.js` | Security & RBAC | Unauthenticated route rejection, student → admin block, account deletion token checks | ✅ Passed |
| `src/tests/course.test.js` | Course Catalog | Course listing, lookup by ID, category filtering | ✅ Passed |
| `src/tests/certificate.test.js` | Certificate System | Public certificate verification hash lookups, non-existent UUID handling | ✅ Passed |

---

## 2. Frontend Testing Suite (Vitest + React Testing Library)

### Executing Frontend Tests
```bash
cd frontend
npm test
```

### Coverage Scope
- Component rendering and state verification (`streak.test.jsx`).
- Navigation protection (`ProtectedRoute` and `RoleGuard` role checks).
