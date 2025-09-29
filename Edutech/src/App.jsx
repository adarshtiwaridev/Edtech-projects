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
import AdminQuiz from "./Pages/AdminQuiz";

function App() {
  return (

    <div>
      <Navbaar/>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/Login" element={<login/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin-quiz" element={<AdminQuiz />} />

      </Routes>
      {/* <Signup/> */}
      {/* <Login/>   */}
      {/* <Courses/> */}
      <Footer/>
      {/* <Login/> */}
    </div>

  )
}

export default App;
