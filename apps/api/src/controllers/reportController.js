const Report = require('../models/Report');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
const fs = require('fs').promises;
const { generateReportFile } = require('../utils/reportGenerator');
const nodemailer = require('nodemailer');

// Get all reports with pagination and filtering
exports.getAllReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, format, search, startDate, endDate } = req.query;

  // Build query
  const query = {};

  // Filter by type
  if (type) query.type = type;

  // Filter by format
  if (format) query.format = format;

  // Search by name (case-insensitive regex)
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Filter by user if not admin
  if (req.user.userType === 'client') {
    query.generatedBy = req.user._id;
  }

  // Pagination
  const skip = (page - 1) * limit;

  const reports = await Report.find(query)
    .populate('generatedBy', 'firstName lastName email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Report.countDocuments(query);

  new ApiResponse(
    200,
    {
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Reports retrieved successfully'
  ).send(res);
});

// Get single report
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id).populate(
    'generatedBy',
    'firstName lastName email'
  );

  if (!report) {
    return next(new ApiError('Report not found', 404));
  }

  // Check permissions - users can only see their own reports unless admin
  if (
    req.user.userType === 'client' &&
    report.generatedBy._id.toString() !== req.user._id.toString()
  ) {
    return next(new ApiError('Access denied', 403));
  }

  new ApiResponse(200, { report }, 'Report retrieved successfully').send(res);
});

// Generate new report
exports.generateReport = asyncHandler(async (req, res, next) => {
  const { type, format, dateRange, filters, name } = req.body;

  // Validation
  if (!type || !format || !dateRange) {
    return next(new ApiError('Type, format, and dateRange are required', 400));
  }

  if (!dateRange.startDate || !dateRange.endDate) {
    return next(new ApiError('Both startDate and endDate are required', 400));
  }

  // Validate date range
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  if (startDate > endDate) {
    return next(new ApiError('Start date must be before or equal to end date', 400));
  }

  // Generate report name if not provided
  const reportName =
    name ||
    `${type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Report - ${new Date().toLocaleDateString()}`;

  // Create report record with 'generating' status
  const report = await Report.create({
    name: reportName,
    type,
    format,
    dateRange: {
      startDate,
      endDate,
    },
    filters: filters || {},
    fileUrl: '', // Will be updated after generation
    generatedBy: req.user._id,
    status: 'generating',
  });

  try {
    // Generate the actual report file
    const result = await generateReportFile(
      type,
      format,
      {
        startDate,
        endDate,
      },
      filters || {}
    );

    // Ensure uploads/reports directory exists
    const uploadsDir = path.join(__dirname, '../../uploads/reports');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file
    const filename = `report-${type}-${req.user._id}-${Date.now()}.${result.extension}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, result.buffer);

    // Calculate file size
    const stats = await fs.stat(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${(fileSizeInBytes / 1024).toFixed(2)} KB`;

    // Update report with file info and completed status
    report.fileUrl = `/uploads/reports/${filename}`;
    report.fileSize = fileSize;
    report.status = 'completed';
    report.metadata = {
      recordCount: result.recordCount || 0,
      totalValue: result.totalValue || 0,
      parameters: filters || {},
    };

    await report.save();

    // Populate and return
    await report.populate('generatedBy', 'firstName lastName email');

    new ApiResponse(201, { report }, 'Report generated successfully').send(res);
  } catch (error) {
    // Update report status to failed
    report.status = 'failed';
    await report.save();

    console.error('Report generation error:', error);
    return next(new ApiError(`Failed to generate report: ${error.message}`, 500));
  }
});

// Get configuration options for a report type
exports.configureReport = asyncHandler(async (req, res, next) => {
  const { type } = req.body;

  if (!type) {
    return next(new ApiError('Report type is required', 400));
  }

  // Return configuration options based on report type
  const configurations = {
    shipment: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'status', type: 'select', options: ['pending', 'in_transit', 'delivered'] },
        { name: 'client', type: 'select', options: [] }, // Will be populated from DB
        { name: 'includeCharts', type: 'boolean' },
      ],
    },
    financial: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'groupBy', type: 'select', options: ['month', 'category', 'shipment'] },
        { name: 'includeCharts', type: 'boolean' },
        { name: 'includeSummary', type: 'boolean' },
      ],
    },
    client_performance: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'client', type: 'select', options: [] },
        { name: 'includeCharts', type: 'boolean' },
      ],
    },
    container_utilization: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'containerType', type: 'select', options: ['20ft_standard', '40ft_standard'] },
        { name: 'status', type: 'select', options: ['available', 'in_use', 'maintenance'] },
      ],
    },
    performance_analytics: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'metrics', type: 'multiselect', options: ['kpi', 'trends', 'efficiency'] },
        { name: 'includeCharts', type: 'boolean' },
      ],
    },
    supplier_performance: {
      formats: ['pdf', 'excel', 'csv'],
      filters: [
        { name: 'supplier', type: 'select', options: [] },
        { name: 'includeRatings', type: 'boolean' },
      ],
    },
  };

  const config = configurations[type];

  if (!config) {
    return next(new ApiError('Invalid report type', 400));
  }

  new ApiResponse(200, { configuration: config }, 'Configuration retrieved successfully').send(res);
});

// Download report file
exports.downloadReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ApiError('Report not found', 404));
  }

  // Check permissions
  if (
    req.user.userType === 'client' &&
    report.generatedBy.toString() !== req.user._id.toString()
  ) {
    return next(new ApiError('Access denied', 403));
  }

  if (report.status !== 'completed') {
    return next(new ApiError('Report is not ready for download', 400));
  }

  // Get file path
  const filePath = path.join(__dirname, '../..', report.fileUrl);

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (error) {
    return next(new ApiError('Report file not found', 404));
  }

  // Increment download count
  report.downloadCount += 1;
  await report.save();

  // Set appropriate headers
  const extension = path.extname(filePath).substring(1);
  const contentTypes = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  res.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${report.name}.${extension}"`);

  // Stream file
  const fileStream = require('fs').createReadStream(filePath);
  fileStream.pipe(res);
});

// Email report to recipients
exports.emailReport = asyncHandler(async (req, res, next) => {
  const { recipients } = req.body;
  const report = await Report.findById(req.params.id).populate(
    'generatedBy',
    'firstName lastName email'
  );

  if (!report) {
    return next(new ApiError('Report not found', 404));
  }

  // Check permissions
  if (
    req.user.userType === 'client' &&
    report.generatedBy._id.toString() !== req.user._id.toString()
  ) {
    return next(new ApiError('Access denied', 403));
  }

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return next(new ApiError('Recipients array is required', 400));
  }

  if (report.status !== 'completed') {
    return next(new ApiError('Report is not ready to be sent', 400));
  }

  // Get file path
  const filePath = path.join(__dirname, '../..', report.fileUrl);

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (error) {
    return next(new ApiError('Report file not found', 404));
  }

  // Check if SMTP is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    return next(
      new ApiError(
        'Email service not configured. Please configure SMTP settings in environment variables.',
        503
      )
    );
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: `Report: ${report.name}`,
      html: `
        <h2>Ceylon Cargo Transport - Report</h2>
        <p>Please find attached the requested report: <strong>${report.name}</strong></p>
        <p><strong>Report Details:</strong></p>
        <ul>
          <li>Type: ${report.type.replace(/_/g, ' ').toUpperCase()}</li>
          <li>Format: ${report.format.toUpperCase()}</li>
          <li>Date Range: ${new Date(report.dateRange.startDate).toLocaleDateString()} - ${new Date(report.dateRange.endDate).toLocaleDateString()}</li>
          <li>Generated By: ${report.generatedBy.firstName} ${report.generatedBy.lastName}</li>
          <li>Generated On: ${new Date(report.createdAt).toLocaleString()}</li>
        </ul>
        <p>Best regards,<br/>Ceylon Cargo Transport Team</p>
      `,
      attachments: [
        {
          filename: `${report.name}.${path.extname(report.fileUrl).substring(1)}`,
          path: filePath,
        },
      ],
    });

    new ApiResponse(200, null, 'Report sent successfully via email').send(res);
  } catch (error) {
    console.error('Email sending error:', error);
    return next(new ApiError(`Failed to send email: ${error.message}`, 500));
  }
});

// Delete report
exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ApiError('Report not found', 404));
  }

  // Check permissions - only owner or super admin can delete
  const isSuperAdmin = req.user.role?.name === 'super_admin';
  const isOwner = report.generatedBy.toString() === req.user._id.toString();

  if (!isSuperAdmin && !isOwner) {
    return next(new ApiError('Access denied. Only report owner or super admin can delete', 403));
  }

  // Delete file if it exists
  if (report.fileUrl) {
    const filePath = path.join(__dirname, '../..', report.fileUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log('Report file not found or could not be deleted:', error.message);
    }
  }

  // Delete database record
  await Report.findByIdAndDelete(req.params.id);

  new ApiResponse(200, null, 'Report deleted successfully').send(res);
});

// Get report statistics
exports.getReportStats = asyncHandler(async (req, res) => {
  // Total reports
  const totalReports = await Report.countDocuments({
    status: 'completed',
  });

  // Reports this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const thisMonth = await Report.countDocuments({
    status: 'completed',
    createdAt: {
      $gte: firstDayOfMonth,
      $lte: lastDayOfMonth,
    },
  });

  // Calculate storage used
  const reports = await Report.find({ status: 'completed' });
  let totalBytes = 0;

  for (const report of reports) {
    if (report.fileUrl) {
      try {
        const filePath = path.join(__dirname, '../..', report.fileUrl);
        const stats = await fs.stat(filePath);
        totalBytes += stats.size;
      } catch (error) {
        // File not found, skip
        console.log(`File not found for report ${report.reportId}`);
      }
    }
  }

  // Convert to GB
  const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Scheduled reports (always 0 for now as per user decision)
  const scheduledReports = 0;

  new ApiResponse(
    200,
    {
      totalReports,
      thisMonth,
      scheduledReports,
      storageUsed: `${storageUsedGB} GB`,
      storageUsedBytes: totalBytes,
    },
    'Report statistics retrieved successfully'
  ).send(res);
});
