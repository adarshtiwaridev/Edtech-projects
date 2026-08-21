# Kodemates EdTech Application Security Architecture

Overview of security principles, authentication, authorization, and threat mitigation practices implemented in the platform.

---

## Security Implementation Matrix

| Security Layer | Technology / Implementation | Protection Scope |
| :--- | :--- | :--- |
| **Authentication** | Dual-Token JWT (Bearer Header + HTTP-Only Cookie) | Prevents token theft via XSS |
| **Authorization** | `auth`, `student`, `instructor`, `admin` Middlewares | Enforces server-side RBAC |
| **Password Storage** | `bcrypt` (10 rounds work factor) | Protects against credential dictionary attacks |
| **Data Sanitization** | `express-mongo-sanitize` | Prevents NoSQL Query Injection attacks |
| **HTTP Headers** | `helmet` middleware | Mitigates XSS, clickjacking, MIME sniffing |
| **Rate Limiting** | `express-rate-limit` (`authLimiter`, `apiLimiter`) | Prevents brute-force credential attacks |
| **Route Protection** | `RoleGuard` + `ProtectedRoute` in React Router | Client-side UX access control |
| **Session Control** | Multi-device `StudentSession` tracking | Allows remote session termination |
| **Payment Integrity** | Server-side Razorpay HMAC SHA256 verification | Prevents client payment tampering |

---

## Applied Security Fixes (Audit Phase)

1. **Exposed Credentials Removal:** Removed hardcoded Atlas connection string from `backend/.env.example`.
2. **Account Deletion Endpoint Secured:** Enforced `auth` middleware on `DELETE /api/users/deleteAccount` in `User.js`.
3. **Admin Quiz Builder Route Protected:** Wrapped `/admin-quiz` and `/admin-quiz-builder` in `<ProtectedRoute>` and `<RoleGuard>` in `App.jsx`.
