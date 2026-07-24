import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}); 

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_USER,   
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};
