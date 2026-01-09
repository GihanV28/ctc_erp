const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const emailService = require('../services/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/inquiries');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `inquiry-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types: PDF, DOC, DOCX, Excel, CSV, Images
  const allowedTypes = /pdf|doc|docx|xls|xlsx|csv|jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|text\/csv|image\/(jpeg|jpg|png|gif)/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, Excel, CSV, and image files are allowed'));
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

/**
 * @desc    Submit inquiry/support message
 * @route   POST /api/inquiries
 * @access  Public (can be used by anyone, authenticated or not)
 */
exports.submitInquiry = asyncHandler(async (req, res, next) => {
  const { name, email, subject, category, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return next(new ApiError('Please provide name, email, subject, and message', 400));
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError('Please provide a valid email address', 400));
  }

  // Get attached file info if exists
  const attachmentInfo = req.file ? {
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  } : null;

  // Prepare email content
  const companyEmail = 'info.cct@ceylongrp.com';
  const emailSubject = `New Inquiry: ${subject}`;

  // Create HTML email with attachment info
  let emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
        New Inquiry Received
      </h2>

      <div style="margin: 20px 0;">
        <h3 style="color: #374151;">Contact Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Category:</strong> ${category || 'General Inquiry'}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #374151;">Subject</h3>
        <p>${subject}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #374151;">Message</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>

      ${attachmentInfo ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #374151; margin-top: 0;">Attachment</h3>
        <p><strong>File:</strong> ${attachmentInfo.originalname}</p>
        <p><strong>Size:</strong> ${(attachmentInfo.size / 1024).toFixed(2)} KB</p>
        <p><strong>Type:</strong> ${attachmentInfo.mimetype}</p>
        <p style="color: #6b7280; font-size: 12px;">
          <em>Note: File is stored on the server at: ${attachmentInfo.path}</em>
        </p>
      </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>This is an automated message from the Ceylon Cargo Transport inquiry system.</p>
        <p>Received at: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;

  try {
    // Send email to company
    await emailService.sendEmail({
      to: companyEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
          Thank you for contacting Ceylon Cargo Transport
        </h2>

        <p>Dear ${name},</p>

        <p>We have received your inquiry and will get back to you as soon as possible.</p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Your Inquiry Details</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Category:</strong> ${category || 'General Inquiry'}</p>
          ${attachmentInfo ? `<p><strong>Attachment:</strong> ${attachmentInfo.originalname}</p>` : ''}
        </div>

        <p>Our support team will review your message and respond within 24-48 hours.</p>

        <p>If you have any urgent questions, please contact us at:</p>
        <ul>
          <li>Email: info.cct@ceylongrp.com</li>
          <li>Phone: +94 11 234 5678</li>
        </ul>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Best regards,<br>Ceylon Cargo Transport Team</p>
          <p style="margin-top: 15px;">This is an automated confirmation email.</p>
        </div>
      </div>
    `;

    await emailService.sendEmail({
      to: email,
      subject: 'Inquiry Confirmation - Ceylon Cargo Transport',
      html: confirmationHtml,
    });

    res.json(new ApiResponse(200, {
      message: 'Inquiry submitted successfully',
      attachmentUploaded: !!attachmentInfo
    }, 'Your inquiry has been submitted. We will contact you soon.'));

  } catch (error) {
    console.error('Email sending error:', error);

    // Even if email fails, we should acknowledge the submission
    // In production, you might want to save to database as fallback
    res.json(new ApiResponse(200, {
      message: 'Inquiry received but email notification failed. We will process it manually.',
      attachmentUploaded: !!attachmentInfo,
      note: 'Email service not configured yet'
    }, 'Your inquiry has been received.'));
  }
});

/**
 * @desc    Get inquiry statistics (admin only)
 * @route   GET /api/inquiries/stats
 * @access  Private (Admin)
 */
exports.getInquiryStats = asyncHandler(async (req, res, next) => {
  // This can be implemented later when you have a database for inquiries
  res.json(new ApiResponse(200, {
    totalInquiries: 0,
    pendingInquiries: 0,
    resolvedInquiries: 0
  }, 'Inquiry statistics'));
});
