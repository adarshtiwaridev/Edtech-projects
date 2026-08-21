# Kodemates EdTech REST API Inventory

Complete catalog of all backend REST API routes automatically extracted from controller and routing modules.

---

## REST API Endpoint Catalog

| Method | Endpoint | Module | Auth Required | Allowed Role | Validation | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/users/sendotp` | Auth | No | Public | Zod (`sendOtpSchema`) | Send email verification OTP |
| `POST` | `/api/users/signup` | Auth | No | Public | Zod (`signupSchema`) | Register student/teacher |
| `POST` | `/api/users/login` | Auth | No | Public | Zod (`loginSchema`) | Issue access & refresh tokens |
| `POST` | `/api/users/logout` | Auth | No | Public | Cookie Clear | Invalidate refresh token cookie |
| `POST` | `/api/users/refresh` | Auth | No (Cookie) | Public | Refresh Cookie | Issue new access token |
| `DELETE`| `/api/users/deleteAccount`| Auth | Yes | Authenticated | Token Payload | Soft/Hard delete user account |
| `PUT` | `/api/users/changePassword`| Auth | Yes | Authenticated | Request Body | Change current password |
| `POST` | `/api/users/resetPasswordToken`| Auth | No | Public | Email Body | Send reset password link |
| `POST` | `/api/users/resetPassword/:token`| Auth | No | Public | Token Param | Complete password reset |
| `GET` | `/api/profiles/getUserDetails` | Profile | Yes | Authenticated | Bearer Token | Get user profile data |
| `PUT` | `/api/profiles/updateProfile` | Profile | Yes | Authenticated | Profile Body | Update bio, DOB, gender |
| `GET` | `/api/profiles/getEnrolledCourses` | Profile | Yes | Student | Bearer Token | List student enrolled courses |
| `POST` | `/api/courses/createCourse` | Course | Yes | Teacher / Admin | Controller checks | Create new course |
| `PUT` | `/api/courses/updateCourse/:courseId`| Course | Yes | Teacher / Admin | Course ID Param | Edit course details |
| `DELETE`| `/api/courses/deleteCourse/:courseId`| Course | Yes | Teacher / Admin | Course ID Param | Delete course |
| `GET` | `/api/courses/getAllCourses` | Course | No | Public | None | List published courses |
| `POST` | `/api/courses/createSection` | Course | Yes | Teacher / Admin | Section Body | Add module section |
| `POST` | `/api/courses/createSubSection` | Course | Yes | Teacher / Admin | Form Data | Upload lecture video/data |
| `POST` | `/api/courses/updateCourseProgress`| Course | Yes | Student | SubSection ID | Mark lecture complete |
| `POST` | `/api/payment/capturePayment` | Payment | Yes | Student | Course IDs Array | Create Razorpay order |
| `POST` | `/api/payment/verifyPayment` | Payment | Yes | Student | Signature Body | Verify payment & enroll |
| `GET` | `/api/admin/dashboard-stats` | Admin | Yes | Admin | RoleGuard | Platform-wide stats |
| `GET` | `/api/admin/users` | Admin | Yes | Admin | RoleGuard | User management list |
| `PUT` | `/api/admin/user/status` | Admin | Yes | Admin | Status Body | Activate or ban user account |
| `GET` | `/api/v1/student/dashboard/overview`| Student | Yes | Authenticated | Bearer Token | Student overview & streak |
| `GET` | `/api/v1/student/security/sessions`| Student | Yes | Authenticated | Bearer Token | Active login device list |
| `DELETE`| `/api/v1/student/security/sessions/:sessionId`| Student | Yes | Authenticated | Session ID | Terminate active remote session |
| `POST` | `/api/v1/student/streak/log` | Student | Yes | Authenticated | Bearer Token | Record daily activity visit |
| `POST` | `/api/v1/quiz/create` | Quiz | Yes | Teacher / Admin | Zod / Schema | Create quiz (Manual/AI) |
| `POST` | `/api/v1/quiz/pdf-extract` | Quiz | Yes | Teacher / Admin | File Upload | AI PDF Quiz Extractor |
| `POST` | `/api/v1/quiz/:quizId/start` | Quiz | Yes | Student | Quiz ID Param | Start timed quiz attempt |
| `POST` | `/api/v1/quiz/attempt/:attemptId/submit`| Quiz | Yes | Student | Attempt ID Param | Submit answers & score |
| `POST` | `/api/v1/enhanced/certificates/generate`| Certificate | Yes | Student | Course ID Body | Auto-generate PDF certificate |
| `GET` | `/api/v1/enhanced/certificates/verify/:verificationId`| Certificate | No | Public | Verification ID | Public certificate lookup |
| `POST` | `/api/v1/enhanced/code/execute` | Code Runner | Yes | Student | Code Body | Run code snippet |
| `GET` | `/api/health` | System | No | Public | None | Health check & status |
