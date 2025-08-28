// Import the required modules
const express = require("express");
const router = express.Router();

// Import the controllers
const { capturePayment, verifySignature } = require("../controllers/Payments");

// Import the middleware
const { auth, student } = require("../middleware/Auth");

// ********************************************************************************************************
//                                      Payments routes
// ********************************************************************************************************

// Route for capturing payments (only for students)
router.post("/capturePayment", auth, student, capturePayment);

// Route for verifying signature
router.post("/verifySignature", verifySignature);

// Export router
module.exports = router;
