const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Generate invoice PDF for a shipment
 * @param {Object} shipment - Shipment document with populated client
 * @param {Array} lineItems - Array of invoice line items
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateInvoicePDF(shipment, lineItems = []) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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
    const HEADER_HEIGHT = letterheadImage ? 140 : 50;

    // Add first page with letterhead
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let currentY = PAGE_HEIGHT - HEADER_HEIGHT;

    // Draw letterhead if available
    if (letterheadImage) {
      page.drawImage(letterheadImage, {
        x: 0,
        y: 0,
        width: PAGE_WIDTH,
        height: LETTERHEAD_HEIGHT,
      });
    }

    // Invoice title
    page.drawText('INVOICE', {
      x: MARGIN_LEFT,
      y: currentY,
      size: 24,
      font: helveticaBold,
      color: rgb(0.3, 0, 0.5), // Purple color
    });
    currentY -= 40;

    // Billed To section
    page.drawText('Billed To:', {
      x: MARGIN_LEFT,
      y: currentY,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 20;

    // Client information
    const client = shipment.client;
    const billingAddress = client.billingAddress?.sameAsAddress === false
      ? client.billingAddress
      : client.address;

    // Contact person name
    const contactName = `${client.contactPerson?.firstName || ''} ${client.contactPerson?.lastName || ''}`.trim();
    if (contactName) {
      page.drawText(contactName, {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }

    // Company name
    if (client.companyName) {
      page.drawText(client.companyName, {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }

    // Address
    if (billingAddress?.street) {
      page.drawText(billingAddress.street, {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }

    // City, State, Postal Code
    const cityLine = [
      billingAddress?.city,
      billingAddress?.state,
      billingAddress?.postalCode
    ].filter(Boolean).join(', ');

    if (cityLine) {
      page.drawText(cityLine, {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }

    // Country
    if (billingAddress?.country) {
      page.drawText(billingAddress.country, {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 25;
    }

    // Shipment Details section
    page.drawText('Shipment Details', {
      x: MARGIN_LEFT,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 25;

    // Details in two columns
    const leftColX = MARGIN_LEFT;
    const rightColX = PAGE_WIDTH / 2 + 20;
    const labelWidth = 100;

    // Left column
    // Order ID
    page.drawText('Order ID:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(shipment.shipmentId || 'N/A', {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Right column - Date
    const invoiceDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    page.drawText('Date:', {
      x: rightColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(invoiceDate, {
      x: rightColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 18;

    // Tracking ID
    page.drawText('Tracking ID:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(shipment.trackingNumber || 'N/A', {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 18;

    // Container No.
    page.drawText('Container No.:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(shipment.cargo?.containerType || 'N/A', {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 18;

    // Origin after Port
    const originText = `${shipment.origin?.port || 'N/A'}, ${shipment.origin?.country || ''}`;
    page.drawText('Origin after Port:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(originText, {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 18;

    // Destination Port at London Galway, UK
    const destinationText = `${shipment.destination?.port || 'N/A'}, ${shipment.destination?.country || ''}`;
    page.drawText('Destination Port:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(destinationText, {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 18;

    // Estimated date
    const estimatedDate = shipment.dates?.estimatedArrival
      ? new Date(shipment.dates.estimatedArrival).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'N/A';
    page.drawText('Estimated:', {
      x: leftColX,
      y: currentY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(estimatedDate, {
      x: leftColX + labelWidth,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 35;

    // Payment Summary section
    page.drawText('Payment Summary', {
      x: MARGIN_LEFT,
      y: currentY,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    currentY -= 25;

    // Table headers
    const tableTop = currentY;
    const rowHeight = 20;
    const headerBg = rgb(0.95, 0.95, 0.95);

    // Column positions and widths
    const columns = [
      { label: 'Description', x: MARGIN_LEFT + 5, width: 90 },
      { label: 'HS', x: MARGIN_LEFT + 95, width: 30 },
      { label: 'Qty', x: MARGIN_LEFT + 125, width: 25 },
      { label: 'Cartons', x: MARGIN_LEFT + 150, width: 40 },
      { label: 'Net Weight', x: MARGIN_LEFT + 190, width: 50 },
      { label: 'Gross Weight', x: MARGIN_LEFT + 240, width: 60 },
      { label: 'Dimensions', x: MARGIN_LEFT + 300, width: 60 },
      { label: 'Freight', x: MARGIN_LEFT + 360, width: 45 },
      { label: 'Customs', x: MARGIN_LEFT + 405, width: 50 },
      { label: 'Total', x: MARGIN_LEFT + 455, width: 40 },
    ];

    // Draw header background
    page.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 5,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: headerBg,
    });

    // Draw header border
    page.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 5,
      width: CONTENT_WIDTH,
      height: rowHeight,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
    });

    // Draw column headers
    columns.forEach((col) => {
      page.drawText(col.label, {
        x: col.x,
        y: currentY,
        size: 8,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
    });
    currentY -= rowHeight;

    // If no line items provided, create one from shipment cargo data
    if (!lineItems || lineItems.length === 0) {
      lineItems = [
        {
          description: shipment.cargo?.description || 'Cargo',
          hs: '',
          qty: shipment.cargo?.quantity || 1,
          cartons: 0,
          netWeight: shipment.cargo?.weight || 0,
          grossWeight: shipment.cargo?.weight ? Math.round(shipment.cargo.weight * 1.1) : 0,
          dimensions: shipment.cargo?.volume ? `${shipment.cargo.volume}m³` : '',
          freight: shipment.totalCost ? Math.round(shipment.totalCost * 0.85) : 0,
          customs: 0,
          total: shipment.totalCost || 0,
        },
      ];
    }

    // Draw table rows
    let subtotal = 0;
    lineItems.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        page.drawRectangle({
          x: MARGIN_LEFT,
          y: currentY - 5,
          width: CONTENT_WIDTH,
          height: rowHeight,
          color: rgb(0.98, 0.98, 0.98),
        });
      }

      // Draw row border
      page.drawRectangle({
        x: MARGIN_LEFT,
        y: currentY - 5,
        width: CONTENT_WIDTH,
        height: rowHeight,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 0.5,
      });

      // Draw cell values
      const rowData = [
        item.description || '',
        item.hs || '',
        String(item.qty || ''),
        String(item.cartons || ''),
        item.netWeight ? `${item.netWeight} kg` : '',
        item.grossWeight ? `${item.grossWeight} kg` : '',
        item.dimensions || '',
        item.freight ? `$${item.freight}` : '$0',
        item.customs ? `$${item.customs}` : '0',
        item.total ? `$${item.total}` : '$0',
      ];

      rowData.forEach((value, i) => {
        const text = String(value).substring(0, 15); // Truncate if too long
        page.drawText(text, {
          x: columns[i].x,
          y: currentY,
          size: 8,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      subtotal += item.total || 0;
      currentY -= rowHeight;
    });

    // Summary section
    currentY -= 10;
    const summaryX = PAGE_WIDTH - MARGIN_RIGHT - 150;

    // Subtotal
    page.drawText('Subtotal', {
      x: summaryX,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`$${subtotal.toFixed(2)}`, {
      x: summaryX + 80,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 20;

    // Duties/Tax (9%)
    const tax = subtotal * 0.09;
    page.drawText('Duties/Tax(9%)', {
      x: summaryX,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`$${tax.toFixed(2)}`, {
      x: summaryX + 80,
      y: currentY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    currentY -= 25;

    // Total (bold)
    const total = subtotal + tax;
    page.drawText('Total', {
      x: summaryX,
      y: currentY,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    page.drawText(`$${total.toFixed(2)}`, {
      x: summaryX + 80,
      y: currentY,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });

    // Note section
    currentY -= 40;
    if (shipment.notes) {
      page.drawText('Note:', {
        x: MARGIN_LEFT,
        y: currentY,
        size: 10,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;

      // Wrap note text
      const noteLines = wrapText(shipment.notes, CONTENT_WIDTH - 10, helveticaFont, 9);
      noteLines.forEach((line) => {
        page.drawText(line, {
          x: MARGIN_LEFT,
          y: currentY,
          size: 9,
          font: helveticaFont,
          color: rgb(0.3, 0.3, 0.3),
        });
        currentY -= 12;
      });
    }

    // Footer with barcode placeholder
    const footerY = 50;
    page.drawText('0334 8876 90125 345', {
      x: PAGE_WIDTH - MARGIN_RIGHT - 100,
      y: footerY,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
}

/**
 * Helper function to wrap text
 */
function wrapText(text, maxWidth, font, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

module.exports = {
  generateInvoicePDF,
};
