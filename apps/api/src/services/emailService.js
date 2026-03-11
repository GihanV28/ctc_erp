const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
exports.sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Ceylon Cargo Transport'}" <${
        process.env.SMTP_FROM
      }>`,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user, password) => {
  const subject = 'Welcome to Ceylon Cargo Transport';
  const html = `
    <h1>Welcome ${user.firstName}!</h1>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Temporary Password:</strong> ${password}</p>
    <p>Please log in and change your password immediately.</p>
    <p>Login at: ${process.env.ADMIN_URL || 'http://localhost:3001'}/login</p>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  if (!resetUrl) {
    const baseUrl = user.userType === 'client'
      ? (process.env.CLIENT_URL || 'http://localhost:3002')
      : (process.env.ADMIN_URL || 'http://localhost:3001');
    resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  }

  const subject = 'Password Reset Request - Ceylon Cargo Transport';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password. Click the button below:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#7c3aed;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">Reset Password</a>
      <p style="margin-top:16px;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
      <p style="color:#6b7280;font-size:13px;">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return exports.sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Send shipment tracking update email
exports.sendTrackingUpdateEmail = async (client, shipment, trackingUpdate) => {
  const subject = `Shipment Update: ${shipment.shipmentId}`;
  const html = `
    <h1>Shipment Tracking Update</h1>
    <p>Hi ${client.contactPerson.firstName},</p>
    <p>Your shipment <strong>${shipment.trackingId}</strong> has been updated.</p>
    <p><strong>Status:</strong> ${trackingUpdate.status}</p>
    <p><strong>Location:</strong> ${trackingUpdate.location.name}, ${trackingUpdate.location.country}</p>
    <p><strong>Update:</strong> ${trackingUpdate.description}</p>
    <p>Track your shipment: ${process.env.CLIENT_URL}/shipments/${shipment._id}</p>
  `;

  return exports.sendEmail({
    to: client.contactPerson.email,
    subject,
    html,
  });
};