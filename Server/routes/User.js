// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auths")

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/Resetpassword")

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

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login || ((req, res) => res.status(500).json({ error: "login handler missing" })))

// Route for user signup
router.post("/signup", signup || ((req, res) => res.status(500).json({ error: "signup handler missing" })))

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp || ((req, res) => res.status(500).json({ error: "sendotp handler missing" })))

// Route for Changing the password
router.post("/changepassword", auth, changePassword || ((req, res) => res.status(500).json({ error: "changePassword handler missing" })))

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken || ((req, res) => res.status(500).json({ error: "resetPasswordToken handler missing" })))

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword || ((req, res) => res.status(500).json({ error: "resetPassword handler missing" })))

// Export the router for use in the main application
module.exports = router
