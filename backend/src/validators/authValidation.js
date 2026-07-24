const { z } = require("zod");

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

const signupSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    accountType: z.enum(["Admin", "Student", "Teacher"]),
    otp: z.string().min(6, "OTP must be at least 6 digits"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6, "OTP must be at least 6 digits"),
  }),
});

module.exports = {
  sendOtpSchema,
  signupSchema,
  loginSchema,
  verifyOtpSchema,
};
