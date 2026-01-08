require('dotenv').config();
const mongoose = require('mongoose');
const Shipment = require('../src/models/Shipment');
const Client = require('../src/models/Client');

async function checkShipments() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the client
    const clientId = '695f0964f61b3e5f042fdd50';
    const client = await Client.findById(clientId);

    console.log('\nClient:', client ? client.companyName : 'Not found');
    console.log('Client ID:', clientId);

    // Find all shipments
    const allShipments = await Shipment.find({})
      .populate('client', 'clientId companyName')
      .select('shipmentId trackingNumber status client');

    console.log(`\nTotal shipments in database: ${allShipments.length}\n`);

    if (allShipments.length > 0) {
      console.log('All shipments:');
      allShipments.forEach(shipment => {
        console.log(`- ${shipment.shipmentId} | ${shipment.trackingNumber} | Client: ${shipment.client?.companyName || 'N/A'} (${shipment.client?._id}) | Status: ${shipment.status}`);
      });
    }

    // Find shipments for this specific client
    const clientShipments = await Shipment.find({ client: clientId })
      .populate('client', 'clientId companyName')
      .select('shipmentId trackingNumber status');

    console.log(`\n\nShipments for client ${clientId}: ${clientShipments.length}\n`);

    if (clientShipments.length > 0) {
      console.log('Client-specific shipments:');
      clientShipments.forEach(shipment => {
        console.log(`- ${shipment.shipmentId} | ${shipment.trackingNumber} | Status: ${shipment.status}`);
      });
    } else {
      console.log('⚠️ No shipments found for this client!');
      console.log('The admin needs to create shipments and assign them to this client.');
    }

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkShipments();
