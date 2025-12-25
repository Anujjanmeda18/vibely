import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // ✅ Add these for better reliability
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
});

// ✅ Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email service error:", error);
  } else {
    console.log("✅ Email service ready");
  }
});

const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Vibely" <${process.env.EMAIL}>`,
      to,
      subject: "🔐 Reset Your Password - Vibely",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0ea5e9;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0f172a; letter-spacing: 8px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP expires in 5 minutes.</p>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 12px;">Vibely - Curate your vibe</p>
        </div>
      `,
    });
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.log("❌ Email send error:", error);
    throw error;
  }
};

export default sendMail;
