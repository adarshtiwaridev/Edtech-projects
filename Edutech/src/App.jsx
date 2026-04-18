import { Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Navbaar from "./Components/Navbaar";
import Footer from "./Components/Footer";
import Courses from "./Components/courses";
import Blogs from "./Components/blogs";
import Quiz from "./Pages/Quiz";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminQuiz from "./Pages/AdminQuiz";
import VerifyOtp from "./Pages/VerifyOtp";
import NotFound from "./Pages/NotFound";
import ForgotPassword from "./Pages/ForgotPassword";
// dashboard route added to support profile links/navigation
import Dashboard from "./Pages/Dashbord";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleGuard from "./Components/dashboard/RoleGuard";
import Setting from "./Pages/dashboard/Setting";
import ResetPassword from "./Pages/ResetPassword";
import Cart from "./Pages/dashboard/Cart";
import TeacherCoursesPage from "./Pages/dashboard/teacher/TeacherCoursesPage";
import TeacherCourseFormPage from "./Pages/dashboard/teacher/TeacherCourseFormPage";
import StudentBrowseCoursesPage from "./Pages/dashboard/student/StudentBrowseCoursesPage";
import StudentCourseDetailsPage from "./Pages/dashboard/student/StudentCourseDetailsPage";
import StudentMyCoursesPage from "./Pages/dashboard/student/StudentMyCoursesPage";
import StudentLearnCoursePage from "./Pages/dashboard/student/StudentLearnCoursePage";
import Checkout from "./Pages/dashboard/student/Cheackout";
function App() {
  return (

    <div>
      <Navbaar/>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path ="/signup" element={<Signup/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin-quiz" element={<AdminQuiz />} />
        <Route path="/Forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={
            
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
        <Route path="/dashboard/my-profile" element={
      
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/setting" element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        } />
        <Route
          path="/dashboard/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* dashboard route (lowercase) wrapped in auth guard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/courses"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Teacher"]}>
                <TeacherCoursesPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/courses/create"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Teacher"]}>
                <TeacherCourseFormPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/courses/:id/edit"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Teacher"]}>
                <TeacherCourseFormPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student/browse"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Student"]}>
                <StudentBrowseCoursesPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/course/:id"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Student", "Teacher"]}>
                <StudentCourseDetailsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/my-courses"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Student"]}>
                <StudentMyCoursesPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/learn/:id"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Student"]}>
                <StudentLearnCoursePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

        {/* The :token part allows the component to read the unique ID from the email link */}
   <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
      {/* <Contact/> */}
      <Footer/>
    </div>

  )
}

export default App;
