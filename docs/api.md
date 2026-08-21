# Kodemates EdTech REST API Specification

Documentation for core REST API endpoints.

---

## 1. Authentication Endpoints

### `POST /api/users/login`
- **Description:** Authenticate user credentials and return access token & set refresh cookie.
- **Request Body:**
  ```json
  {
    "email": "student@kodemates.com",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully!",
    "user": {
      "_id": "607f1f77bcf86cd799439011",
      "firstName": "John",
      "email": "student@kodemates.com",
      "accountType": "Student"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

---

## 2. Health & System Endpoints

### `GET /api/health`
- **Description:** System health check endpoint.
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "success": true,
    "message": "✅ Kodemates EdTech Backend API is running",
    "environment": "development",
    "timestamp": "2026-08-21T22:10:00.000Z"
  }
  ```

---

## 3. Quiz & AI Extractor Endpoints

### `POST /api/v1/quiz/pdf-extract`
- **Description:** Extract questions from uploaded PDF and return structured JSON quiz.
- **Header:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data` with `file` key containing PDF file.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Quiz extracted from PDF successfully",
    "quiz": {
      "title": "Extracted Operating System Assessment",
      "questions": []
    }
  }
  ```
