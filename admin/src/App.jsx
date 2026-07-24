import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboardPage from "./Pages/dashboard/admin/AdminDashboardPage";
import AdminCoursesPage from "./Pages/dashboard/admin/AdminCoursesPage";
import AdminCategoriesPage from "./Pages/dashboard/admin/AdminCategoriesPage";
import AdminUsersPage from "./Pages/dashboard/admin/AdminUsersPage";
import AdminTeachersPage from "./Pages/dashboard/admin/AdminTeachersPage";
import AdminQuiz from "./Pages/AdminQuiz";
import NotFound from "./Pages/NotFound";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleGuard from "./Components/dashboard/RoleGuard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Admin"]}>
              <DashboardLayout />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="quiz" element={<AdminQuiz />} />
        <Route path="admin" element={<Navigate to="/" replace />} />
        <Route path="admin/*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
