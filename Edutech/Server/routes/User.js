const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  logout,
  changePassword,
  verifyOtp,
  deleteAccount,
  refreshToken,
} = require("../Controllers/Auths");

const {
  resetPasswordToken,
  resetPassword,
} = require("../Controllers/Resetpassword");


const { createContactus } = require("../Controllers/Contactus");

const { auth } = require("../middleware/Auth");
const { authLimiter, apiLimiter } = require("../middleware/rateLimit");
const validate = require("../middleware/validate");
const { sendOtpSchema, signupSchema, loginSchema, verifyOtpSchema } = require("../validations/authValidation");

/* ================= SAFETY CHECK ================= */

if (typeof auth !== "function") {
  throw new Error("auth middleware is not a function");
}

/* ================= AUTH ROUTES ================= */

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/sendotp", authLimiter, validate(sendOtpSchema), sendotp);
router.post("/logout", logout);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/refresh", authLimiter, refreshToken);
router.post("/contactus", apiLimiter, createContactus);

router.delete("/deleteAccount",  deleteAccount);

/* ================= PASSWORD ROUTES ================= */

router.put("/changePassword", auth, changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword/:token", resetPassword);



module.exports = router;