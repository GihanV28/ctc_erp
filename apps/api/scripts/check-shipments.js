const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function checkShipments() {
  try {
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');

    await mongoose.connect(mongoURI, { family: 4 });
    console.log('✅ Connected to MongoDB\n');

    // Load all models
    const Client = require('../src/models/Client');
    const Supplier = require('../src/models/Supplier');
    const Shipment = require('../src/models/Shipment');

    const shipments = await Shipment.find({}).populate('client supplier', 'companyName').lean();

    console.log('📦 SHIPMENTS IN DATABASE');
    console.log('='.repeat(70));
    console.log('Total Count:', shipments.length);
    console.log('');

    shipments.forEach(s => {
      console.log('ID:', s.shipmentId);
      console.log('Status:', s.status);
      console.log('Client:', s.client?.companyName || 'N/A');
      console.log('Supplier:', s.supplier?.companyName || 'N/A');
      console.log('Booking Date:', s.dates?.bookingDate);
      console.log('Created At:', s.createdAt);
      console.log('-'.repeat(70));
    });

    // Check status counts
    const statusCounts = await Shipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 STATUS BREAKDOWN:');
    statusCounts.forEach(sc => {
      console.log(`  ${sc._id}: ${sc.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkShipments();
