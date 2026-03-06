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
import ProtectedRoute from "./components/ProtectedRoute";

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

        {/* dashboard route (lowercase) wrapped in auth guard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer/>
    </div>

  )
}

export default App;
