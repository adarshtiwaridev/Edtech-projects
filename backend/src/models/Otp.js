const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto delete after 5 minutes
  },
});

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
module.exports = Otp;