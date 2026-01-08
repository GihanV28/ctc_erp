const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Shipment = require('../models/Shipment');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Client = require('../models/Client');
const Container = require('../models/Container');
const Supplier = require('../models/Supplier');

/**
 * Main function to generate report file
 * @param {string} type - Report type
 * @param {string} format - File format (pdf, excel, csv)
 * @param {object} dateRange - {startDate, endDate}
 * @param {object} filters - Additional filters
 * @returns {Promise<{buffer: Buffer, extension: string, recordCount: number, totalValue: number}>}
 */
exports.generateReportFile = async (type, format, dateRange, filters) => {
  // Get data based on report type
  let data, metadata;

  switch (type) {
    case 'shipment':
      ({ data, metadata } = await getShipmentData(dateRange, filters));
      break;
    case 'financial':
      ({ data, metadata } = await getFinancialData(dateRange, filters));
      break;
    case 'client_performance':
      ({ data, metadata } = await getClientPerformanceData(dateRange, filters));
      break;
    case 'container_utilization':
      ({ data, metadata } = await getContainerUtilizationData(dateRange, filters));
      break;
    case 'performance_analytics':
      ({ data, metadata } = await getPerformanceAnalyticsData(dateRange, filters));
      break;
    case 'supplier_performance':
      ({ data, metadata } = await getSupplierPerformanceData(dateRange, filters));
      break;
    default:
      throw new Error(`Unknown report type: ${type}`);
  }

  // Generate file based on format
  let buffer, extension;

  switch (format) {
    case 'pdf':
      buffer = await generatePDF(data, type, dateRange, metadata);
      extension = 'pdf';
      break;
    case 'excel':
      buffer = generateExcel(data, type, metadata);
      extension = 'xlsx';
      break;
    case 'csv':
      buffer = Buffer.from(generateCSV(data), 'utf-8');
      extension = 'csv';
      break;
    default:
      throw new Error(`Unknown format: ${format}`);
  }

  return {
    buffer,
    extension,
    recordCount: metadata.recordCount || data.length,
    totalValue: metadata.totalValue || 0,
  };
};

// ====== DATA FETCHING FUNCTIONS ======

async function getShipmentData(dateRange, filters) {
  const query = {
    createdAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  };

  if (filters.status) query.status = filters.status;
  if (filters.client) query.client = filters.client;

  const shipments = await Shipment.find(query)
    .populate('client', 'companyName clientId')
    .populate('supplier', 'companyName supplierId')
    .sort({ createdAt: -1 });

  const data = shipments.map((s) => ({
    shipmentId: s.shipmentId,
    trackingNumber: s.trackingNumber,
    client: s.client?.companyName || 'N/A',
    supplier: s.supplier?.companyName || 'N/A',
    status: s.status,
    origin: `${s.route?.origin?.port || 'N/A'}, ${s.route?.origin?.country || 'N/A'}`,
    destination: `${s.route?.destination?.port || 'N/A'}, ${s.route?.destination?.country || 'N/A'}`,
    cost: s.totalCost || 0,
    currency: s.currency || 'USD',
    bookingDate: s.dates?.bookingDate?.toLocaleDateString() || 'N/A',
    estimatedArrival: s.dates?.estimatedArrival?.toLocaleDateString() || 'N/A',
  }));

  const totalValue = shipments.reduce((sum, s) => sum + (s.totalCost || 0), 0);

  return {
    data,
    metadata: {
      recordCount: data.length,
      totalValue,
    },
  };
}

async function getFinancialData(dateRange, filters) {
  const query = {
    date: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  };

  const [incomes, expenses] = await Promise.all([Income.find(query), Expense.find(query)]);

  const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  const data = [
    {
      category: 'Total Income',
      amount: totalIncome,
      count: incomes.length,
    },
    {
      category: 'Total Expenses',
      amount: totalExpenses,
      count: expenses.length,
    },
    {
      category: 'Net Profit',
      amount: netProfit,
      count: '-',
    },
    {
      category: '',
      amount: '',
      count: '',
    },
    { category: '--- Income Breakdown ---', amount: '', count: '' },
    ...incomes.map((i) => ({
      category: i.source || 'Other',
      amount: i.amount,
      count: i.description || 'N/A',
    })),
    {
      category: '',
      amount: '',
      count: '',
    },
    { category: '--- Expense Breakdown ---', amount: '', count: '' },
    ...expenses.map((e) => ({
      category: e.category || 'Other',
      amount: e.amount,
      count: e.description || 'N/A',
    })),
  ];

  return {
    data,
    metadata: {
      recordCount: incomes.length + expenses.length,
      totalValue: totalIncome,
      totalIncome,
      totalExpenses,
      netProfit,
    },
  };
}

async function getClientPerformanceData(dateRange, filters) {
  const query = {
    createdAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  };

  if (filters.client) query.client = filters.client;

  const shipments = await Shipment.find(query).populate('client', 'companyName clientId');

  // Group by client
  const clientMap = {};

  shipments.forEach((s) => {
    const clientId = s.client?._id?.toString();
    if (!clientId) return;

    if (!clientMap[clientId]) {
      clientMap[clientId] = {
        clientName: s.client.companyName,
        clientId: s.client.clientId,
        shipmentCount: 0,
        totalRevenue: 0,
        onTimeDeliveries: 0,
        totalDeliveries: 0,
      };
    }

    clientMap[clientId].shipmentCount++;
    clientMap[clientId].totalRevenue += s.totalCost || 0;

    if (s.status === 'delivered') {
      clientMap[clientId].totalDeliveries++;
      if (
        s.dates?.actualArrival &&
        s.dates?.estimatedArrival &&
        s.dates.actualArrival <= s.dates.estimatedArrival
      ) {
        clientMap[clientId].onTimeDeliveries++;
      }
    }
  });

  const data = Object.values(clientMap).map((c) => ({
    ...c,
    onTimeRate:
      c.totalDeliveries > 0
        ? `${((c.onTimeDeliveries / c.totalDeliveries) * 100).toFixed(1)}%`
        : 'N/A',
  }));

  const totalRevenue = data.reduce((sum, c) => sum + c.totalRevenue, 0);

  return {
    data,
    metadata: {
      recordCount: data.length,
      totalValue: totalRevenue,
    },
  };
}

async function getContainerUtilizationData(dateRange, filters) {
  const query = {};

  if (filters.containerType) query.type = filters.containerType;
  if (filters.status) query.status = filters.status;

  const containers = await Container.find(query);

  const data = containers.map((c) => ({
    containerId: c.containerId,
    type: c.type,
    size: c.size,
    status: c.status,
    condition: c.condition,
    location: c.currentLocation || 'N/A',
    lastInspection: c.lastInspectionDate?.toLocaleDateString() || 'N/A',
  }));

  // Calculate utilization stats
  const total = containers.length;
  const inUse = containers.filter((c) => c.status === 'in_use').length;
  const utilizationRate = total > 0 ? ((inUse / total) * 100).toFixed(1) : 0;

  return {
    data,
    metadata: {
      recordCount: total,
      totalValue: 0,
      utilizationRate: `${utilizationRate}%`,
      inUse,
      total,
    },
  };
}

async function getPerformanceAnalyticsData(dateRange, filters) {
  const query = {
    createdAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  };

  const [shipments, incomes, expenses] = await Promise.all([
    Shipment.find(query),
    Income.find({ date: query.createdAt }),
    Expense.find({ date: query.createdAt }),
  ]);

  const totalRevenue = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalCost = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  const deliveredOnTime = shipments.filter(
    (s) =>
      s.status === 'delivered' &&
      s.dates?.actualArrival &&
      s.dates?.estimatedArrival &&
      s.dates.actualArrival <= s.dates.estimatedArrival
  ).length;

  const totalDelivered = shipments.filter((s) => s.status === 'delivered').length;
  const onTimeRate = totalDelivered > 0 ? ((deliveredOnTime / totalDelivered) * 100).toFixed(1) : 0;

  const data = [
    { metric: 'Total Shipments', value: shipments.length },
    { metric: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
    { metric: 'Total Costs', value: `$${totalCost.toFixed(2)}` },
    { metric: 'Net Profit', value: `$${netProfit.toFixed(2)}` },
    { metric: 'Profit Margin', value: `${profitMargin}%` },
    { metric: 'On-Time Delivery Rate', value: `${onTimeRate}%` },
    { metric: 'Delivered Shipments', value: totalDelivered },
    { metric: 'In-Transit Shipments', value: shipments.filter((s) => s.status === 'in_transit').length },
  ];

  return {
    data,
    metadata: {
      recordCount: data.length,
      totalValue: totalRevenue,
    },
  };
}

async function getSupplierPerformanceData(dateRange, filters) {
  const query = {
    createdAt: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  };

  if (filters.supplier) query.supplier = filters.supplier;

  const shipments = await Shipment.find(query).populate('supplier', 'companyName supplierId');

  // Group by supplier
  const supplierMap = {};

  shipments.forEach((s) => {
    const supplierId = s.supplier?._id?.toString();
    if (!supplierId) return;

    if (!supplierMap[supplierId]) {
      supplierMap[supplierId] = {
        supplierName: s.supplier.companyName,
        supplierId: s.supplier.supplierId,
        shipmentCount: 0,
        onTimeDeliveries: 0,
        totalDeliveries: 0,
      };
    }

    supplierMap[supplierId].shipmentCount++;

    if (s.status === 'delivered') {
      supplierMap[supplierId].totalDeliveries++;
      if (
        s.dates?.actualArrival &&
        s.dates?.estimatedArrival &&
        s.dates.actualArrival <= s.dates.estimatedArrival
      ) {
        supplierMap[supplierId].onTimeDeliveries++;
      }
    }
  });

  const data = Object.values(supplierMap).map((s) => ({
    ...s,
    onTimeRate:
      s.totalDeliveries > 0
        ? `${((s.onTimeDeliveries / s.totalDeliveries) * 100).toFixed(1)}%`
        : 'N/A',
  }));

  return {
    data,
    metadata: {
      recordCount: data.length,
      totalValue: 0,
    },
  };
}

// ====== FILE GENERATION FUNCTIONS ======

async function generatePDF(data, reportType, dateRange, metadata) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Load and embed letterhead image
  const letterheadPath = path.join(__dirname, '../../public/images/letterhead.png');
  let letterheadImage = null;
  let letterheadDims = null;

  try {
    const letterheadBytes = fs.readFileSync(letterheadPath);
    letterheadImage = await pdfDoc.embedPng(letterheadBytes);
    letterheadDims = letterheadImage.scale(1);
  } catch (error) {
    console.error('Failed to load letterhead:', error.message);
  }

  // A4 size constants
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  // Letterhead dimensions (scaled to fit A4 width)
  const LETTERHEAD_HEIGHT = letterheadImage
    ? (letterheadDims.height * PAGE_WIDTH) / letterheadDims.width
    : 0;
  const HEADER_HEIGHT = letterheadImage ? 140 : 50; // Space reserved for header section
  const FOOTER_HEIGHT = letterheadImage ? 80 : 30; // Space reserved for footer section

  // Helper function to add a new page with letterhead
  const addPageWithLetterhead = () => {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Draw letterhead if available
    if (letterheadImage) {
      page.drawImage(letterheadImage, {
        x: 0,
        y: 0,
        width: PAGE_WIDTH,
        height: LETTERHEAD_HEIGHT,
      });
    }

    return page;
  };

  // Start first page
  let currentPage = addPageWithLetterhead();
  let yPosition = PAGE_HEIGHT - HEADER_HEIGHT - 20;

  // Report title
  const title = reportType.replace(/_/g, ' ').toUpperCase() + ' REPORT';
  currentPage.drawText(title, {
    x: MARGIN_LEFT,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.3, 0, 0.5), // Purple
  });

  yPosition -= 25;

  // Date range
  currentPage.drawText(
    `Period: ${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(
      dateRange.endDate
    ).toLocaleDateString()}`,
    {
      x: MARGIN_LEFT,
      y: yPosition,
      size: 10,
      font,
    }
  );

  yPosition -= 15;

  currentPage.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: MARGIN_LEFT,
    y: yPosition,
    size: 10,
    font,
  });

  yPosition -= 25;

  // Draw line
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: yPosition },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  // Summary statistics (if available)
  if (metadata) {
    if (metadata.recordCount !== undefined) {
      currentPage.drawText(`Total Records: ${metadata.recordCount}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
      yPosition -= 15;
    }

    if (metadata.totalValue !== undefined && metadata.totalValue !== 0) {
      currentPage.drawText(`Total Value: $${metadata.totalValue.toFixed(2)}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
      yPosition -= 15;
    }

    if (metadata.totalIncome) {
      currentPage.drawText(`Total Income: $${metadata.totalIncome.toFixed(2)}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 15;
    }

    if (metadata.totalExpenses) {
      currentPage.drawText(`Total Expenses: $${metadata.totalExpenses.toFixed(2)}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 15;
    }

    if (metadata.netProfit !== undefined) {
      currentPage.drawText(`Net Profit: $${metadata.netProfit.toFixed(2)}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
      yPosition -= 15;
    }

    if (metadata.utilizationRate) {
      currentPage.drawText(`Utilization Rate: ${metadata.utilizationRate}`, {
        x: MARGIN_LEFT,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
      yPosition -= 15;
    }
  }

  yPosition -= 15;

  // Data table with multi-page support
  if (data && data.length > 0) {
    const headers = Object.keys(data[0]);
    const colWidth = Math.min(CONTENT_WIDTH / headers.length, 100);

    // Helper function to draw table headers
    const drawTableHeaders = (page, y) => {
      headers.forEach((header, index) => {
        const headerText = header.toUpperCase();
        const maxWidth = colWidth - 5;
        const truncated =
          font.widthOfTextAtSize(headerText, 8) > maxWidth
            ? headerText.substring(0, Math.floor(maxWidth / 6)) + '..'
            : headerText;

        page.drawText(truncated, {
          x: MARGIN_LEFT + index * colWidth,
          y,
          size: 8,
          font: boldFont,
        });
      });

      // Draw line under headers
      page.drawLine({
        start: { x: MARGIN_LEFT, y: y - 3 },
        end: { x: MARGIN_LEFT + headers.length * colWidth, y: y - 3 },
        thickness: 0.5,
      });

      return y - 18;
    };

    // Draw initial headers
    yPosition = drawTableHeaders(currentPage, yPosition);

    // Data rows with pagination
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Check if we need a new page
      if (yPosition < FOOTER_HEIGHT + 20) {
        currentPage = addPageWithLetterhead();
        yPosition = PAGE_HEIGHT - HEADER_HEIGHT - 20;
        yPosition = drawTableHeaders(currentPage, yPosition);
      }

      headers.forEach((header, index) => {
        const value = String(row[header] || '');
        const maxWidth = colWidth - 5;
        const truncated =
          font.widthOfTextAtSize(value, 7) > maxWidth
            ? value.substring(0, Math.floor(maxWidth / 5)) + '...'
            : value;

        currentPage.drawText(truncated, {
          x: MARGIN_LEFT + index * colWidth,
          y: yPosition,
          size: 7,
          font,
        });
      });

      yPosition -= 12;
    }
  }

  // Add page numbers to all pages
  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    page.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: PAGE_WIDTH - 100,
      y: FOOTER_HEIGHT - 20,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function generateExcel(data, reportType, metadata) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = [
    ['Ceylon Cargo Transport - Report'],
    [''],
    ['Report Type', reportType.replace(/_/g, ' ').toUpperCase()],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Summary Statistics'],
  ];

  if (metadata) {
    if (metadata.recordCount !== undefined) {
      summaryData.push(['Total Records', metadata.recordCount]);
    }
    if (metadata.totalValue !== undefined && metadata.totalValue !== 0) {
      summaryData.push(['Total Value', `$${metadata.totalValue.toFixed(2)}`]);
    }
    if (metadata.totalIncome) {
      summaryData.push(['Total Income', `$${metadata.totalIncome.toFixed(2)}`]);
    }
    if (metadata.totalExpenses) {
      summaryData.push(['Total Expenses', `$${metadata.totalExpenses.toFixed(2)}`]);
    }
    if (metadata.netProfit !== undefined) {
      summaryData.push(['Net Profit', `$${metadata.netProfit.toFixed(2)}`]);
    }
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  // Create data sheet
  if (data && data.length > 0) {
    const dataSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, dataSheet, 'Data');
  }

  // Generate buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

function generateCSV(data) {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = String(row[header] || '');
      // Escape commas and quotes
      return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}
