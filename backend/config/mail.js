import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Vibely <onboarding@resend.dev>',
      to: to,
      subject: '🔐 Reset Your Password - Vibely',
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

    if (error) {
      throw error;
    }

    console.log('✅ Email sent successfully:', data);
  } catch (error) {
    console.log('❌ Resend error:', error);
    throw error;
  }
};

export default sendMail;
