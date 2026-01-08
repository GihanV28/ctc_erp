const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function testStatsEndpoint() {
  try {
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');

    await mongoose.connect(mongoURI, { family: 4 });
    console.log('✅ Connected to MongoDB\n');

    const Shipment = require('../src/models/Shipment');

    // Simulate what the controller does
    const query = {}; // No client filtering for admin

    const totalShipments = await Shipment.countDocuments(query);
    const activeShipments = await Shipment.countDocuments({
      ...query,
      status: { $nin: ['delivered', 'cancelled'] },
    });
    const deliveredShipments = await Shipment.countDocuments({
      ...query,
      status: 'delivered',
    });
    const pendingShipments = await Shipment.countDocuments({
      ...query,
      status: 'pending',
    });

    const stats = {
      total: totalShipments,
      active: activeShipments,
      delivered: deliveredShipments,
      delayed: pendingShipments,
    };

    console.log('📊 STATS ENDPOINT SHOULD RETURN:');
    console.log('='.repeat(60));
    console.log(JSON.stringify(stats, null, 2));
    console.log('='.repeat(60));
    console.log('\n✅ If frontend shows 0, the issue is in the API controller or response format');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testStatsEndpoint();
