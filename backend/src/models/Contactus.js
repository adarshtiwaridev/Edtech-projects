const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  subject: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Contactus", contactusSchema);