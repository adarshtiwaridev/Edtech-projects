const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
  verifyPayment,
  getRazorpayKey,
} = require("../controllers/Payment");

const { auth, student } = require("../middleware/Auth");

router.get("/getRazorpayKey", auth, getRazorpayKey);
router.post("/capturePayment", auth, student, capturePayment);
router.post("/verifyPayment", auth, student, verifyPayment);
router.post("/verifySignature", verifySignature);

module.exports = router;
