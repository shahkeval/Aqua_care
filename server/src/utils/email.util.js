const nodemailer = require('nodemailer');
const env = require('../config/env');

/**
 * Create a reusable transporter.
 * Uses SMTP settings from environment variables.
 */
const createTransporter = () => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials missing. Emails will fail. Please check your .env file.');
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

/**
 * Send a password reset email
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: 'AquaCare — Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">AquaCare Password Reset</h2>
        <p>You have requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; 
                  border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px;">
          This link will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
};
