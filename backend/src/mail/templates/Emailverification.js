// server/mail/CourseEnrollment.js
import nodemailer from "nodemailer";

// You can store these in your .env file
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@example.com";
const SITE_NAME = process.env.SITE_NAME || "My Edtech Site";
const SITE_URL = process.env.SITE_URL || "https://example.com";

// Helper to generate email subject
const getSubject = ({ courseName }) => {
  return `Your enrollment in ${courseName}`;
};

// Helper to generate email text
const getText = ({ courseName, courseUrl, user }) => {
  return `Hello ${user},

You have been enrolled in the course: ${courseName}.

You can access your course here: ${courseUrl}

Thank you for using ${SITE_NAME}.
`;
};

// Initialize Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail", // or another SMTP service
  auth: {
    user: process.env.EMAIL_USER,   // your email
    pass: process.env.EMAIL_PASS,   // your email password or app password
  },
});

// Main function to send enrollment email
export const sendEnrollmentEmail = async ({ userEmail, userName, courseName, courseUrl }) => {
  try {
    if (!userEmail) return;

    const subject = getSubject({ courseName });
    const text = getText({ courseName, courseUrl, user: userName });

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: userEmail,
      subject,
      text,
    });

    console.log(`Enrollment email sent to ${userEmail} for course ${courseName}`);
  } catch (error) {
    console.error(`Error sending enrollment email to ${userEmail}:`, error);
  }
};
