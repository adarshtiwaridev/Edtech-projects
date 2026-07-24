const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./Models/User");
const Profile = require("./Models/Profile");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@tajwin.com";
    const adminPassword = "Admin@123";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Seeding aborted.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: "System Administrator",
      contactNumber: null,
    });

    const adminUser = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      accountType: "Admin",
      status: "Approved",
      additionalDetails: profileDetails._id,
      mobile: "0000000000",
      profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=Super%20Admin`,
    });

    console.log("Admin seeded successfully:", adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
