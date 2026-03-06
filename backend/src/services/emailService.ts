import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured - skipping email send');
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
};

export const sendNotificationEmail = async (userEmail: string, userName: string, message: string) => {
  const subject = 'New Notification - Smart Public Service CRM';
  const html = `
    <h2>Hello ${userName},</h2>
    <p>You have a new notification:</p>
    <p><strong>${message}</strong></p>
    <p>Please log in to your dashboard to view it.</p>
    <hr>
    <p><small>This is an automated message from the Smart Public Service CRM system.</small></p>
  `;

  return await sendEmail(userEmail, subject, html);
};
