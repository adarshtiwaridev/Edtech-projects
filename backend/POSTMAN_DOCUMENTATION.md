# JP EdTech Backend — Postman API Documentation & Verification Guide

This documentation guides you through verifying and testing all REST API endpoints of the `jp-edtech-backend` service using Postman.

---

## 1. How to Import the Collection

1. Open **Postman**.
2. Click **Import** (top left).
3. Select **File** and upload [backend/postman_collection.json](file:///d:/WORKFLOW2025/FULL%20STACK%20DEVELOPEMENT%20supreme%203.0/Edtech-projects/backend/postman_collection.json).
4. The collection **`JP EdTech API Backend Collection`** will appear in your left sidebar.

---

## 2. Environment Variables Configuration

The collection includes built-in variables:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `baseUrl` | Backend API base host URL | `https://kodemates-2.onrender.com` |
| `token` | Bearer JWT token automatically set upon successful login | *(Auto-populated on Login)* |

### Testing Local vs Render Backend:
- **To test Render (Production)**: Keep `baseUrl` = `https://kodemates-2.onrender.com`
- **To test Local Host**: Change `baseUrl` = `http://localhost:5000`

---

## 3. Step-by-Step API Verification Flow

### Step 1: System Health Check
* **Endpoint**: `GET {{baseUrl}}/`
* **Expected Response** `(200 OK)`:
  ```json
  {
    "status": "success",
    "message": "✅ JP EdTech Backend API is running"
  }
  ```

---

### Step 2: User Authentication & Registration

#### 1. Send OTP
* **Method**: `POST {{baseUrl}}/api/users/sendotp`
* **Body (JSON)**:
  ```json
  {
    "email": "student@example.com"
  }
  ```
* **Expected Response**: OTP generated and sent via email.

#### 2. Sign Up User
* **Method**: `POST {{baseUrl}}/api/users/signup`
* **Body (JSON)**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "student@example.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "accountType": "Student",
    "otp": "123456"
  }
  ```

#### 3. Login User
* **Method**: `POST {{baseUrl}}/api/users/login`
* **Body (JSON)**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password@123"
  }
  ```
* **Post-response script**: Automatically extracts `jsonData.token` and populates the `{{token}}` collection variable!

---

### Step 3: Profile Endpoints (Requires Bearer Token)

#### 1. Get User Profile Details
* **Method**: `GET {{baseUrl}}/api/profiles/getUserDetails`
* **Headers**: `Authorization: Bearer {{token}}`
* **Expected Response**: Returns user object, accountType, and profile metadata.

#### 2. Update Profile Information
* **Method**: `PUT {{baseUrl}}/api/profiles/updateProfile`
* **Headers**: `Authorization: Bearer {{token}}`
* **Body (JSON)**:
  ```json
  {
    "gender": "Male",
    "dateOfBirth": "1998-05-15",
    "about": "Enthusiastic Student",
    "contactNumber": "9876543210"
  }
  ```

---

### Step 4: Courses & Public Catalog

#### 1. Get All Courses
* **Method**: `GET {{baseUrl}}/api/courses/getAllCourses`
* **Expected Response**: List of published courses.

#### 2. Get All Categories
* **Method**: `GET {{baseUrl}}/api/courses/showAllCategories`
* **Expected Response**: List of course categories.

---

### Step 5: Admin Verification (Requires Admin Token)

#### 1. Admin Dashboard Stats
* **Method**: `GET {{baseUrl}}/api/admin/dashboard-stats`
* **Headers**: `Authorization: Bearer {{token}}` (Admin account required)

#### 2. Admin User List
* **Method**: `GET {{baseUrl}}/api/admin/users`
* **Headers**: `Authorization: Bearer {{token}}`

---

## 4. Seeding Admin Account

To seed an initial Admin account into your database:
```bash
npm run seed:admin
```
Or execute:
```bash
node src/database/seedAdmin.js
```
Then log in via Postman with:
- **Email**: `admin@tajwin.com`
- **Password**: `Admin@123`
