const contactus = require("../models/Contactus");

/**
 * Create contact message
 * POST /api/users/contactus
 * Body: { name, email, subject, message }
 */
exports.createContactus = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Step 1: Validate all fields
    const validation = validateContactForm({ name, email, subject, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Step 2: Sanitize inputs
    const sanitizedData = sanitizeContactData({ name, email, subject, message });

    // Step 3: Split name into first and last name
    const nameParts = sanitizedData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Step 4: Save message to database
    let newMessage;
    try {
      newMessage = await contactus.create({
        firstName,
        lastName,
        email: sanitizedData.email.toLowerCase(),
        subject: sanitizedData.subject,
        message: sanitizedData.message,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to save message. Please try again later.",
      });
    }

    // Step 5: Send email to user
    try {
      await sendContactConfirmationEmail(
        sanitizedData.email,
        firstName,
        sanitizedData.subject
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      console.warn("Email to user failed, but message was saved");
    }

    // Step 6: Send notification email to admin
    try {
      await sendAdminNotificationEmail(sanitizedData, firstName);
    } catch (adminEmailError) {
      console.error("Admin email error:", adminEmailError);
      console.warn("Admin email  failed, but message was saved");
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll be in touch soon.",
      data: {
        id: newMessage._id,
        email: newMessage.email,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

/**
 * Send confirmation email to the user
 */
const sendContactConfirmationEmail = async (toEmail, firstName, subject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <h2 style="margin: 0 0 15px; color: #333;">Hi ${firstName},</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Thank you for reaching out to us! We've successfully received your message.
        </p>
        <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 5px; font-size: 12px; color: #777; text-transform: uppercase; font-weight: 600;">Subject</p>
          <p style="margin: 0; font-size: 15px; color: #333;">${escapeHtml(subject)}</p>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Our support team typically responds within 24-48 hours. We appreciate your patience!
        </p>
        <p style="color: #999; font-size: 13px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          © ${new Date().getFullYear()} EdTech Platform. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "We've Received Your Message ✓",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send notification email to admin
 */
const sendAdminNotificationEmail = async (data, firstName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Name:</strong> ${escapeHtml(firstName)}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style="margin: 5px 0;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <h3 style="color: #333;">Message:</h3>
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">
        ${escapeHtml(data.message)}
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: adminEmail,
    subject: `[NEW INQUIRY] ${data.subject}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Escape HTML to prevent XSS in emails
 */
const escapeHtml = (text) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Get all contact messages (Admin only)
 * GET /api/users/contactus
 */
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await contactus
      .find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/**
 * Delete a contact message (Admin only)
 * DELETE /api/users/contactus/:id
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const deletedMessage = await contactus.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};
// const contactus = require("../models/Contactus");
const nodemailer = require("nodemailer");
const { validateContactForm, sanitizeContactData } = require("../utils/validateContact");

exports.createContactus = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Step 1: Validate all fields
    const validation = validateContactForm({ name, email, subject, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Step 2: Sanitize inputs
    const sanitizedData = sanitizeContactData({ name, email, subject, message });

    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const newMessage = await contactus.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });


       // Create transporter
       const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
           user: process.env.MAIL_USER,
           pass: process.env.MAIL_PASS,
         },
         connectionTimeout: 10000, // 10 sec safety
       });
   
    const mailOptions = {
  from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
  to: email,
  subject: "Your Message Has Been Received ✔",
  html: `
  <div style="background:#f4f6f9;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#2563eb;padding:24px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:24px;">EdTech Platform</h1>
        <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Thank you for contacting us</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="margin-top:0;color:#111;">Hello ${email},</h2>

        <p style="color:#444;font-size:15px;line-height:1.6;">
          We’ve successfully received your message. Our support team will review it and respond shortly.
        </p>

        <!-- Message Card -->
        <div style="background:#f1f5f9;border-left:4px solid #2563eb;padding:15px;margin:20px 0;border-radius:6px;">
          <p style="margin:0;font-size:14px;color:#333;">
            <strong>Your message has been recorded in our system.</strong>
          </p>
        </div>

        <p style="color:#444;font-size:15px;">
          If your inquiry is urgent, feel free to reply to this email.
        </p>

        <!-- Button -->
        <div style="text-align:center;margin-top:25px;">
          <a href="#" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">
            Visit Our Platform
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#777;">
        © ${new Date().getFullYear()} EdTech Platform • All Rights Reserved
      </div>

    </div>

  </div>
  `,
};

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get all contact us messages


exports.getAllMessages=async(req,res)=>{
    try {
        const messages = await contactus.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All messages fetched successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



