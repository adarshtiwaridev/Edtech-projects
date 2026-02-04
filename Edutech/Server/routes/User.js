const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  logout,
  changePassword,
  verifyOtp,
} = require("../Controllers/Auths");

const {
  resetPasswordToken,
  resetPassword,
} = require("../Controllers/Resetpassword");

const { auth } = require("../middleware/Auth");

// 🚨 Validate middleware/controllers once (SAFE)
if (typeof auth !== "function") {
  throw new Error("auth middleware is not a function");
}

/* ================= AUTH ROUTES ================= */

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);

/* ================= PASSWORD ================= */

router.put("/changePassword", auth, changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);

module.exports = router;
