// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  logout,
  changePassword,
  verifyOtp,
} = require("../Controllers/Auths")

const {
  resetPasswordToken,
  resetPassword,
} = require("../Controllers/Resetpassword")

const { auth } = require("../middleware/Auth")

// Debug: log to check which ones are undefined
console.log({
  login,
  signup,
  sendotp,
  changePassword,
  resetPasswordToken,
  resetPassword,
  auth,
})



// Route for user login
router.post("/login", login || ((req, res) => res.status(500).json({ error: "login handler missing" })))

// Route for user signup
router.post("/signup", signup || ((req, res) => res.status(500).json({ error: "signup handler missing" })))

// Route for sending OTP
router.post("/sendotp", sendotp || ((req, res) => res.status(500).json({ error: "sendotp handler missing" })))
// Route for user logout
router.post("/logout", logout || ((req, res) => res.status(500).json({ error: "logout handler missing" })))
// Route for Changing the password
router.put("/changePassword", auth, changePassword || ((req, res) => res.status(500).json({ error: "changePassword handler missing" })))
//
//verifyOtp
router.post("/verify-otp", verifyOtp);




// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/resetPasswordToken", resetPasswordToken || ((req, res) => res.status(500).json({ error: "resetPasswordToken handler missing" })))

// Route for resetting user's password after verification
router.post("/resetPassword", resetPassword || ((req, res) => res.status(500).json({ error: "resetPassword handler missing" })))

// Export the router for use in the main application
module.exports = router
