// Course enrollment email template for Node.js
// Simple function to generate enrollment email content

const courseEnrollmentEmail = (courseName, userName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">🎉 Course Enrollment Successful!</h2>

      <p>Hello ${userName},</p>

      <p>Congratulations! You have been successfully enrolled in the course:</p>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">${courseName}</h3>
        <p style="margin-bottom: 0;">Your learning journey begins now!</p>
      </div>

      <p>You can now access your course materials and start learning. We're excited to have you on board!</p>

      <p>Best regards,<br>
      Your EdTech Team</p>
    </div>
  `;
};

module.exports = { courseEnrollmentEmail };
