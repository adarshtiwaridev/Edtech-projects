# JP EdTech - Backend API Service

Express/Node.js REST API service for the **JP EdTech** platform providing authentication, course management, payments, profile administration, and management endpoints.

## 🚀 Folder Structure

```text
backend/
├── src/
│   ├── config/         # Cloudinary, Database, and app configuration
│   ├── controllers/    # Request handlers (Auth, Course, Profile, Payment, Admin)
│   ├── services/       # Core business logic services
│   ├── repositories/   # Database access abstraction layer
│   ├── routes/         # Express API route declarations
│   ├── middleware/     # Auth, Error handling, and validation middlewares
│   ├── models/         # Mongoose Schemas (User, Course, Profile, OTP, etc.)
│   ├── validators/     # Request payload validation schemas
│   ├── utils/          # Utility helpers (mailSender, imageUploader, etc.)
│   ├── helpers/        # General helper utilities
│   ├── constants/      # App constants
│   ├── uploads/        # Temp file storage for uploads
│   ├── database/       # DB connection and admin seeder
│   ├── app.js          # Express app configuration & middleware pipeline
│   └── server.js       # HTTP server initialization
├── package.json
├── .env.example
└── README.md
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) & Cookie-Parser
- **Media Cloud**: Cloudinary Integration
- **Payments**: Razorpay Gateway Integration
- **Mailing Service**: Nodemailer (SMTP/Gmail)
- **Security**: Helmet, Express-Mongo-Sanitize, CORS

---

## 🔐 API Endpoints Summary

| Base Path | Description |
| :--- | :--- |
| `POST /api/users/login` | User & Admin authentication |
| `POST /api/users/signup` | Student & Teacher registration |
| `POST /api/users/sendotp` | Send OTP email for verification |
| `POST /api/users/changepassword` | Password reset & updates |
| `GET /api/profiles/getUserDetails` | Fetch authenticated user profile |
| `GET /api/courses/getAllCourses` | Browse available public courses |
| `POST /api/payment/capturePayment` | Initiate Razorpay payment flow |
| `GET /api/admin/all-users` | Fetch users for Admin dashboard |
| `GET /api/admin/stats` | Platform statistics for Admin |

---

## 🛠️ Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and populate your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:5000`.

4. **Seed Initial Admin (Optional)**:
   ```bash
   npm run seed:admin
   ```

---

## ☁️ Deployment Instructions

The backend is fully decoupled and ready for deployment on platforms such as **Render**, **Railway**, **AWS Elastic Beanstalk**, or **DigitalOcean App Platform**:

- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Configure all secrets listed in `.env.example` on your hosting provider dashboard.
