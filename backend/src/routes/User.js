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
} = require("../controllers/Auths");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/Resetpassword");


const { createContactus } = require("../controllers/Contactus");

const { auth } = require("../middleware/Auth");
const { authLimiter, apiLimiter } = require("../middleware/rateLimit");
const validate = require("../middleware/validate");
const { sendOtpSchema, signupSchema, loginSchema, verifyOtpSchema } = require("../validators/authValidation");

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

router.delete("/deleteAccount", auth, deleteAccount);

/* ================= PASSWORD ROUTES ================= */

router.put("/changePassword", auth, changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword/:token", resetPassword);



module.exports = router;