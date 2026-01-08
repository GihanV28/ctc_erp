const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

dns.setServers(['8.8.8.8', '8.8.4.4']);

const Client = require('../src/models/Client');
const Supplier = require('../src/models/Supplier');
const Container = require('../src/models/Container');
const Shipment = require('../src/models/Shipment');
const Expense = require('../src/models/Expense');
const Income = require('../src/models/Income');
const User = require('../src/models/User');

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function populateShipments() {
  try {
    console.log('📊 Populating shipments and financial data...\n');

    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');

    await mongoose.connect(mongoURI, { family: 4 });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing shipments, income, and expenses
    console.log('🗑️ Clearing existing shipments and financial data...');
    await Shipment.deleteMany({});
    await Income.deleteMany({});
    await Expense.deleteMany({});
    console.log('✅ Cleared old data\n');

    // Fetch existing data
    const clients = await Client.find({});
    const suppliers = await Supplier.find({ status: 'active' });
    const containers = await Container.find({});
    const superAdmin = await User.findOne({ email: 'superadmin@ceylongrp.com' });

    console.log(`Found ${clients.length} clients, ${suppliers.length} suppliers, ${containers.length} containers\n`);

    const origins = [
      { port: 'Port of Shanghai', city: 'Shanghai', country: 'China' },
      { port: 'Port of Singapore', city: 'Singapore', country: 'Singapore' },
      { port: 'Colombo Port', city: 'Colombo', country: 'Sri Lanka' },
      { port: 'Port of Dubai', city: 'Dubai', country: 'UAE' },
      { port: 'Port of Hamburg', city: 'Hamburg', country: 'Germany' }
    ];

    const destinations = [
      { port: 'Port of Los Angeles', city: 'Los Angeles', country: 'USA' },
      { port: 'Port of London', city: 'London', country: 'United Kingdom' },
      { port: 'Port of Tokyo', city: 'Tokyo', country: 'Japan' },
      { port: 'Port of Melbourne', city: 'Melbourne', country: 'Australia' },
      { port: 'Port of New York', city: 'New York', country: 'USA' }
    ];

    const cargoTypes = [
      'Electronics components',
      'Industrial machinery',
      'Textile products',
      'Automotive parts',
      'Consumer goods',
      'Food products',
      'Medical equipment',
      'Construction materials'
    ];

    // Create shipments for 2025 (July - December)
    console.log('📦 Creating shipments for 2025 Q3/Q4...');
    let shipmentCount2025 = 0;

    for (let month = 6; month < 12; month++) {
      const shipmentsThisMonth = 3 + Math.floor(Math.random() * 3); // 3-5 shipments per month

      for (let i = 0; i < shipmentsThisMonth; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
        const container = containers[Math.floor(Math.random() * containers.length)];

        const bookingDate = randomDate(
          new Date(2025, month, 1),
          new Date(2025, month, 28)
        );

        const departureDate = addDays(bookingDate, 3 + Math.floor(Math.random() * 7));
        const transitDays = 15 + Math.floor(Math.random() * 25);
        const estimatedArrival = addDays(departureDate, transitDays);

        // 85% on-time delivery rate
        const isOnTime = Math.random() > 0.15;
        const actualArrival = isOnTime
          ? addDays(estimatedArrival, -Math.floor(Math.random() * 2))
          : addDays(estimatedArrival, 1 + Math.floor(Math.random() * 5));

        const status = 'delivered'; // All 2025 shipments are delivered
        const totalCost = 3500 + Math.floor(Math.random() * 10000);

        await Shipment.create({
          client: client._id,
          supplier: supplier._id,
          origin: origins[Math.floor(Math.random() * origins.length)],
          destination: destinations[Math.floor(Math.random() * destinations.length)],
          status,
          cargo: {
            description: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
            weight: 5000 + Math.floor(Math.random() * 15000),
            volume: 20 + Math.floor(Math.random() * 40),
            quantity: 50 + Math.floor(Math.random() * 250),
            containerType: container.type
          },
          dates: {
            bookingDate,
            departureDate,
            estimatedArrival,
            actualArrival
          },
          totalCost,
          currency: 'USD',
          createdAt: bookingDate
        });

        // Create income
        await Income.create({
          source: 'freight_charges',
          description: `Freight charges - ${cargoTypes[Math.floor(Math.random() * cargoTypes.length)]}`,
          amount: totalCost,
          currency: 'USD',
          date: bookingDate,
          paymentMethod: Math.random() > 0.5 ? 'Bank Transfer' : 'Credit Card',
          status: 'received',
          amountReceived: totalCost,
          createdBy: superAdmin._id,
          createdAt: bookingDate
        });

        // Create expenses
        await Expense.create([
          {
            category: 'fuel',
            description: 'Fuel costs',
            amount: Math.floor(totalCost * 0.15),
            currency: 'USD',
            date: departureDate,
            paymentMethod: 'Bank Transfer',
            status: 'paid',
            createdBy: superAdmin._id,
            createdAt: departureDate
          },
          {
            category: 'port_fees',
            description: 'Port handling charges',
            amount: Math.floor(totalCost * 0.08),
            currency: 'USD',
            date: departureDate,
            paymentMethod: 'Credit Card',
            status: 'paid',
            createdBy: superAdmin._id,
            createdAt: departureDate
          }
        ]);

        shipmentCount2025++;
      }
    }

    console.log(`✅ Created ${shipmentCount2025} shipments for 2025\n`);

    // Create shipments for 2026 (January)
    console.log('📦 Creating shipments for 2026 Q1...');
    let shipmentCount2026 = 0;
    const today = new Date();
    const currentDay = today.getDate();

    // Create shipments throughout January 2026
    const january2026Shipments = 15;

    for (let i = 0; i < january2026Shipments; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const container = containers[Math.floor(Math.random() * containers.length)];

      const bookingDate = randomDate(
        new Date(2026, 0, 1),
        new Date(2026, 0, Math.min(currentDay, 28))
      );

      const departureDate = addDays(bookingDate, 3 + Math.floor(Math.random() * 7));
      const transitDays = 15 + Math.floor(Math.random() * 25);
      const estimatedArrival = addDays(departureDate, transitDays);

      // Determine status based on dates
      let status, actualArrival;

      if (estimatedArrival < today) {
        status = 'delivered';
        const isOnTime = Math.random() > 0.15;
        actualArrival = isOnTime
          ? addDays(estimatedArrival, -Math.floor(Math.random() * 2))
          : addDays(estimatedArrival, 1 + Math.floor(Math.random() * 5));
      } else if (departureDate < today) {
        status = 'in_transit';
      } else {
        status = 'pending';
      }

      const totalCost = 3500 + Math.floor(Math.random() * 10000);

      const shipmentData = {
        client: client._id,
        supplier: supplier._id,
        origin: origins[Math.floor(Math.random() * origins.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        status,
        cargo: {
          description: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
          weight: 5000 + Math.floor(Math.random() * 15000),
          volume: 20 + Math.floor(Math.random() * 40),
          quantity: 50 + Math.floor(Math.random() * 250),
          containerType: container.type
        },
        dates: {
          bookingDate,
          departureDate,
          estimatedArrival
        },
        totalCost,
        currency: 'USD',
        createdAt: bookingDate
      };

      if (actualArrival) {
        shipmentData.dates.actualArrival = actualArrival;
      }

      await Shipment.create(shipmentData);

      // Create income
      await Income.create({
        source: 'freight_charges',
        description: `Freight charges - ${cargoTypes[Math.floor(Math.random() * cargoTypes.length)]}`,
        amount: totalCost,
        currency: 'USD',
        date: bookingDate,
        paymentMethod: Math.random() > 0.5 ? 'Bank Transfer' : 'Credit Card',
        status: status === 'delivered' ? 'received' : 'pending',
        amountReceived: status === 'delivered' ? totalCost : 0,
        createdBy: superAdmin._id,
        createdAt: bookingDate
      });

      // Create expenses if departed
      if (status === 'delivered' || status === 'in_transit') {
        await Expense.create([
          {
            category: 'fuel',
            description: 'Fuel costs',
            amount: Math.floor(totalCost * 0.15),
            currency: 'USD',
            date: departureDate,
            paymentMethod: 'Bank Transfer',
            status: 'paid',
            createdBy: superAdmin._id,
            createdAt: departureDate
          },
          {
            category: 'port_fees',
            description: 'Port handling charges',
            amount: Math.floor(totalCost * 0.08),
            currency: 'USD',
            date: departureDate,
            paymentMethod: 'Credit Card',
            status: 'paid',
            createdBy: superAdmin._id,
            createdAt: departureDate
          }
        ]);
      }

      shipmentCount2026++;
    }

    console.log(`✅ Created ${shipmentCount2026} shipments for 2026\n`);

    // Get final counts
    const totalShipments = await Shipment.countDocuments();
    const totalIncome = await Income.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    const statusCounts = await Shipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('🎉 Data population completed!\n');
    console.log('='.repeat(60));
    console.log('📊 FINAL DATABASE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total Shipments: ${totalShipments}`);
    console.log(`✅ Total Income Records: ${totalIncome}`);
    console.log(`✅ Total Expense Records: ${totalExpenses}`);
    console.log('\n📊 SHIPMENT STATUS BREAKDOWN:');
    statusCounts.forEach(sc => {
      console.log(`   ${sc._id}: ${sc.count}`);
    });
    console.log('='.repeat(60));
    console.log('\n✅ Database is ready with comprehensive data!');
    console.log('🚀 Shipments span from July 2025 to January 2026!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateShipments();
