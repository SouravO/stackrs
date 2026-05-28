import nodemailer from 'nodemailer';

// This is a reference for your backend (Node.js/Express)
// You cannot run this directly in the browser for security reasons.

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_GMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD' // Use an App Password from Google
  }
});

/**
 * Sends an OTP to the user's email
 * @param {string} email 
 * @param {string} otp 
 */
export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: '"Stackr Engine" <YOUR_GMAIL@gmail.com>',
    to: email,
    subject: 'Your Stackr Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0a1120; color: white; padding: 40px; border-radius: 20px;">
        <h2 style="color: #f9bb1a; text-transform: uppercase;">Stackr Verification</h2>
        <p>Your OTP for account creation is:</p>
        <div style="background-color: #121c31; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; border: 1px solid #f9bb1a; color: #f9bb1a;">
          ${otp}
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
