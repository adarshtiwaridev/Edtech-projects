const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["Male", "Female", "Not Specified"],
    default: "Not Specified"
  },
  dateOfBirth: { type: Date },
  address: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
}, { collection: "profiles" });

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
module.exports = Profile;
