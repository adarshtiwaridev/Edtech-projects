import { Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Courses from "./Components/courses";
import Blogs from "./Components/blogs";
import Quiz from "./Pages/Quiz";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminQuiz from "./Pages/AdminQuiz";
import AdminLogin from "./Pages/AdminLogin";
import VerifyOtp from "./Pages/VerifyOtp";
import NotFound from "./Pages/NotFound";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Dashboard Pages
import Dashboard from "./Pages/Dashbord";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleGuard from "./Components/dashboard/RoleGuard";
import Setting from "./Pages/dashboard/Setting";
import Cart from "./Pages/dashboard/Cart";
import TeacherCoursesPage from "./Pages/dashboard/teacher/TeacherCoursesPage";
import TeacherCourseFormPage from "./Pages/dashboard/teacher/TeacherCourseFormPage";
import AdminCategoriesPage from "./Pages/dashboard/admin/AdminCategoriesPage";
import AdminDashboardPage from "./Pages/dashboard/admin/AdminDashboardPage";
import AdminCoursesPage from "./Pages/dashboard/admin/AdminCoursesPage";
import AdminUsersPage from "./Pages/dashboard/admin/AdminUsersPage";
import AdminTeachersPage from "./Pages/dashboard/admin/AdminTeachersPage";
import StudentBrowseCoursesPage from "./Pages/dashboard/student/StudentBrowseCoursesPage";
import StudentCourseDetailsPage from "./Pages/dashboard/student/StudentCourseDetailsPage";
import StudentMyCoursesPage from "./Pages/dashboard/student/StudentMyCoursesPage";
import StudentLearnCoursePage from "./Pages/dashboard/student/StudentLearnCoursePage";
import Checkout from "./Pages/dashboard/student/Cheackout";

import AdminQuizCreator from "./Pages/AdminQuizCreator";
import StudentQuizAttemptScreen from "./Pages/StudentQuizAttemptScreen";
import QuizResultDashboard from "./Pages/QuizResultDashboard";
import PublicCertificateVerifyPage from "./Pages/PublicCertificateVerifyPage";

import AdminQuizRecordsPage from "./Pages/dashboard/admin/AdminQuizRecordsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes with Navbaar and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin-quiz" element={<AdminQuiz />} />
        <Route path="/admin-quiz-builder" element={<AdminQuizCreator />} />
        <Route path="/attempt-quiz/:quizId" element={<StudentQuizAttemptScreen />} />
        <Route path="/quiz-result/:attemptId" element={<QuizResultDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="/Forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-certificate/:verificationId" element={<PublicCertificateVerifyPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Dashboard Routes with Sidebar and Topbar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default Dashboard Profile */}
        <Route index element={<Dashboard />} />
        <Route path="my-profile" element={<Dashboard />} />
        <Route path="setting" element={<Setting />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/courses"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminCoursesPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/quiz-records"
          element={
            <RoleGuard allowedRoles={["Admin", "Teacher", "Instructor"]}>
              <AdminQuizRecordsPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/categories"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminCategoriesPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminUsersPage />
            </RoleGuard>
          }
        />
        <Route
          path="admin/teachers"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminTeachersPage />
            </RoleGuard>
          }
        />

        {/* Teacher / Instructor Routes */}
        <Route
          path="teacher/courses"
          element={
            <RoleGuard allowedRoles={["Teacher", "Instructor"]}>
              <TeacherCoursesPage />
            </RoleGuard>
          }
        />
        <Route
          path="teacher/courses/create"
          element={
            <RoleGuard allowedRoles={["Teacher", "Instructor"]}>
              <TeacherCourseFormPage />
            </RoleGuard>
          }
        />
        <Route
          path="teacher/courses/:id/edit"
          element={
            <RoleGuard allowedRoles={["Teacher", "Instructor"]}>
              <TeacherCourseFormPage />
            </RoleGuard>
          }
        />

        {/* Student Routes */}
        <Route
          path="student/browse"
          element={
            <RoleGuard allowedRoles={["Student"]}>
              <StudentBrowseCoursesPage />
            </RoleGuard>
          }
        />
        <Route
          path="student/course/:id"
          element={
            <RoleGuard allowedRoles={["Student", "Teacher", "Instructor"]}>
              <StudentCourseDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path="student/my-courses"
          element={
            <RoleGuard allowedRoles={["Student"]}>
              <StudentMyCoursesPage />
            </RoleGuard>
          }
        />
        <Route
          path="student/learn/:id"
          element={
            <RoleGuard allowedRoles={["Student"]}>
              <StudentLearnCoursePage />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

