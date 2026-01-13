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
    // Using CID attachment for embedded logo image (most reliable method for email clients)
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with Embedded Logo -->
        <div style="background-color: #1e1b4b; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <a href="https://cct.ceylongrp.com" style="text-decoration: none;">
            <img src="cid:companyLogo" alt="Ceylon Cargo Transport" style="height: 60px; width: auto; display: block; margin: 0 auto;" />
          </a>
        </div>

        <!-- Main Content -->
        <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #7c3aed; margin-top: 0; margin-bottom: 24px;">
            Thank you for contacting Ceylon Cargo Transport
          </h2>

          <p style="color: #374151; font-size: 16px;">Dear ${name},</p>

          <p style="color: #374151; font-size: 16px;">We have received your inquiry and will get back to you as soon as possible.</p>

          <div style="margin: 24px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #7c3aed;">
            <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Your Inquiry Details</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Category:</strong> ${category || 'General Inquiry'}</p>
            ${attachmentInfo ? `<p style="margin: 8px 0; color: #374151;"><strong>Attachment:</strong> ${attachmentInfo.originalname}</p>` : ''}
          </div>

          <p style="color: #374151; font-size: 16px;">Our support team will review your message and respond within 24-48 hours.</p>

          <p style="color: #374151; font-size: 16px;">If you have any urgent questions, please contact us at:</p>
          <ul style="color: #374151; font-size: 16px;">
            <li>Email: <a href="mailto:info.cct@ceylongrp.com" style="color: #7c3aed;">info.cct@ceylongrp.com</a></li>
            <li>Phone: +855 95 386 475</li>
            <li>Telegram: <a href="https://t.me/CEYLONCARGO" style="color: #7c3aed;">@CEYLONCARGO</a></li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="background-color: #1e1b4b; padding: 24px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Best regards,<br><strong>Ceylon Cargo Transport Team</strong></p>
          <p style="color: #a5b4fc; margin: 0; font-size: 12px;">B05, Lek muoy, Sangkat 1, Preah Sihanouk, Cambodia</p>
          <div style="margin-top: 16px;">
            <a href="https://www.facebook.com/share/1CNmDjWEJg/" style="color: #a5b4fc; text-decoration: none; margin: 0 8px;">Facebook</a>
            <a href="https://t.me/CEYLONCARGO" style="color: #a5b4fc; text-decoration: none; margin: 0 8px;">Telegram</a>
          </div>
          <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 11px;">This is an automated confirmation email.</p>
        </div>
      </div>
    `;

    // Logo attachment for embedding in email (CID = Content-ID for inline embedding)
    const logoPath = path.join(__dirname, '../../public/images/logo.png');

    await emailService.sendEmail({
      to: email,
      subject: 'Inquiry Confirmation - Ceylon Cargo Transport',
      html: confirmationHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'companyLogo' // Same as the cid used in img src
        }
      ]
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
