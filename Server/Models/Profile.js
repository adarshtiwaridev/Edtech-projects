const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

   gender: {
    type: String,

    enum: ["male" ,"female","Not Specified"],
    default: ""
    },
    dateOfBirth: { type: Date,  trim:true },
    address: { type: String,  trim:true },
    contactNumber: { type: String,  trim:true },


}, { collection: "profiles" });
const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
