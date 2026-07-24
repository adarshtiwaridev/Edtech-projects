// utils/sendEmail.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for others like 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1>${title}</h1>
          <p>${body}</p>
          <p>Thank you for using our service!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return false;
  }
};

module.exports = sendEmail;
