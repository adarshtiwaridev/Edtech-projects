import { Route, Routes } from "react-router-dom";
import React from "react"
import Home from "./Pages/Home"
function App() {
  return (

    <div>
      <Routes>
        
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<h1>About </h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />

      </Routes>
    </div>

  )
}

export default App;
