require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dns = require("dns");
const User = require("../models/User");
const Profile = require("../models/Profile");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;
    if (!mongoUri || !mongoUri.trim()) {
      console.error("❌ MONGO_URI is missing from environment variables.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri.trim());
    console.log("✅ Connected to MongoDB for admin seeding");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@tajwin.com";
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@123";

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

    console.log("✅ Admin seeded successfully:", adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
