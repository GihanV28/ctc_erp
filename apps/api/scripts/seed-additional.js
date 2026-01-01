const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configure DNS to use Google's public DNS servers for SRV record lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import existing models
const Client = require('../src/models/Client');

async function seedAdditional() {
  try {
    console.log('🌱 Starting additional data seed for testing...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI.replace('/?', '/cct_cargo?');
    await mongoose.connect(mongoURI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log('✅ Connected to MongoDB\n');

    // Define models first
    const Supplier = mongoose.model('Supplier', new mongoose.Schema({
      supplierId: { type: String, unique: true, uppercase: true },
      name: { type: String, required: true },
      serviceType: {
        type: String,
        enum: ['ocean_freight', 'air_freight', 'customs', 'warehouse', 'transport', 'insurance'],
        required: true
      },
      contactPerson: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
      },
      address: {
        street: String,
        city: String,
        country: String,
        postalCode: String
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
      },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      activeContracts: { type: Number, default: 0 }
    }, { timestamps: true }));

    const Shipment = mongoose.model('Shipment', new mongoose.Schema({
      shipmentId: { type: String, unique: true, uppercase: true },
      trackingNumber: { type: String, unique: true },
      client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
      status: {
        type: String,
        enum: ['pending', 'in_transit', 'customs', 'delivered', 'cancelled'],
        default: 'pending'
      },
      origin: {
        port: String,
        country: String,
        city: String
      },
      destination: {
        port: String,
        country: String,
        city: String
      },
      cargo: {
        description: String,
        weight: Number,
        volume: Number,
        containerType: String,
        quantity: Number
      },
      dates: {
        bookingDate: Date,
        departureDate: Date,
        estimatedArrival: Date,
        actualArrival: Date
      },
      supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
      totalCost: Number,
      currency: { type: String, default: 'USD' }
    }, { timestamps: true }));

    const Container = mongoose.model('Container', new mongoose.Schema({
      containerId: { type: String, unique: true, uppercase: true },
      containerNumber: { type: String, unique: true },
      type: {
        type: String,
        enum: ['20ft_standard', '40ft_standard', '40ft_high_cube', '20ft_refrigerated', '40ft_refrigerated'],
        required: true
      },
      status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance', 'damaged'],
        default: 'available'
      },
      location: String,
      currentShipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
      },
      lastInspectionDate: Date,
      purchaseDate: Date,
      purchasePrice: Number
    }, { timestamps: true }));

    const Invoice = mongoose.model('Invoice', new mongoose.Schema({
      invoiceId: { type: String, unique: true, uppercase: true },
      invoiceNumber: { type: String, unique: true },
      client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
      shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
      issueDate: { type: Date, default: Date.now },
      dueDate: Date,
      status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        default: 'draft'
      },
      items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number
      }],
      subtotal: Number,
      tax: Number,
      total: Number,
      currency: { type: String, default: 'USD' },
      paymentMethod: String,
      paidDate: Date,
      notes: String
    }, { timestamps: true }));

    // Clear existing additional data (keep users, roles, clients)
    console.log('🗑️  Clearing existing additional data...');
    await Supplier.deleteMany({});
    await Shipment.deleteMany({});
    await Container.deleteMany({});
    await Invoice.deleteMany({});
    console.log('✅ Cleared existing additional data\n');

    // ==================== CREATE SUPPLIERS ====================
    console.log('🚢 Creating sample suppliers...');

    await Supplier.create([
      {
        supplierId: 'SUP-001',
        name: 'Maersk Line',
        serviceType: 'ocean_freight',
        contactPerson: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@maersk.com',
          phone: '+45 33 63 33 63'
        },
        address: {
          street: 'Esplanaden 50',
          city: 'Copenhagen',
          country: 'Denmark',
          postalCode: '1098'
        },
        status: 'active',
        rating: 4.8,
        activeContracts: 12
      },
      {
        supplierId: 'SUP-002',
        name: 'DHL Global Forwarding',
        serviceType: 'air_freight',
        contactPerson: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@dhl.com',
          phone: '+1 800 225 5345'
        },
        address: {
          street: '1200 South Pine Island Road',
          city: 'Plantation',
          country: 'USA',
          postalCode: '33324'
        },
        status: 'active',
        rating: 4.6,
        activeContracts: 8
      },
      {
        supplierId: 'SUP-003',
        name: 'Sri Lanka Customs Services',
        serviceType: 'customs',
        contactPerson: {
          firstName: 'Raj',
          lastName: 'Fernando',
          email: 'raj.f@slcustoms.lk',
          phone: '+94 11 234 5678'
        },
        address: {
          street: '40 Main Street',
          city: 'Colombo',
          country: 'Sri Lanka',
          postalCode: '00100'
        },
        status: 'active',
        rating: 4.5,
        activeContracts: 15
      }
    ]);

    console.log('✅ Created 3 suppliers\n');

    // ==================== CREATE SHIPMENTS ====================
    console.log('📦 Creating sample shipments...');

    // Get the demo client ID
    const demoClient = await Client.findOne({ companyName: 'Demo Trading Company' });

    const suppliers = await Supplier.find();

    await Shipment.create([
      {
        shipmentId: 'SHP-001',
        trackingNumber: 'CCT2024001',
        client: demoClient._id,
        status: 'in_transit',
        origin: {
          port: 'Shanghai Port',
          country: 'China',
          city: 'Shanghai'
        },
        destination: {
          port: 'Colombo Port',
          country: 'Sri Lanka',
          city: 'Colombo'
        },
        cargo: {
          description: 'Electronics and Computer Parts',
          weight: 15000,
          volume: 35,
          containerType: '40ft Standard',
          quantity: 2
        },
        dates: {
          bookingDate: new Date('2024-01-15'),
          departureDate: new Date('2024-01-20'),
          estimatedArrival: new Date('2024-02-05'),
          actualArrival: null
        },
        supplier: suppliers[0]._id,
        totalCost: 8500,
        currency: 'USD'
      },
      {
        shipmentId: 'SHP-002',
        trackingNumber: 'CCT2024002',
        client: demoClient._id,
        status: 'customs',
        origin: {
          port: 'Dubai Port',
          country: 'UAE',
          city: 'Dubai'
        },
        destination: {
          port: 'Colombo Port',
          country: 'Sri Lanka',
          city: 'Colombo'
        },
        cargo: {
          description: 'Textiles and Garments',
          weight: 8000,
          volume: 20,
          containerType: '20ft Standard',
          quantity: 1
        },
        dates: {
          bookingDate: new Date('2024-01-10'),
          departureDate: new Date('2024-01-12'),
          estimatedArrival: new Date('2024-01-25'),
          actualArrival: new Date('2024-01-24')
        },
        supplier: suppliers[1]._id,
        totalCost: 4200,
        currency: 'USD'
      },
      {
        shipmentId: 'SHP-003',
        trackingNumber: 'CCT2024003',
        client: demoClient._id,
        status: 'delivered',
        origin: {
          port: 'Singapore Port',
          country: 'Singapore',
          city: 'Singapore'
        },
        destination: {
          port: 'Colombo Port',
          country: 'Sri Lanka',
          city: 'Colombo'
        },
        cargo: {
          description: 'Machinery Parts',
          weight: 22000,
          volume: 55,
          containerType: '40ft High Cube',
          quantity: 2
        },
        dates: {
          bookingDate: new Date('2024-01-01'),
          departureDate: new Date('2024-01-05'),
          estimatedArrival: new Date('2024-01-18'),
          actualArrival: new Date('2024-01-17')
        },
        supplier: suppliers[0]._id,
        totalCost: 12000,
        currency: 'USD'
      },
      {
        shipmentId: 'SHP-004',
        trackingNumber: 'CCT2024004',
        client: demoClient._id,
        status: 'pending',
        origin: {
          port: 'Rotterdam Port',
          country: 'Netherlands',
          city: 'Rotterdam'
        },
        destination: {
          port: 'Colombo Port',
          country: 'Sri Lanka',
          city: 'Colombo'
        },
        cargo: {
          description: 'Automotive Parts',
          weight: 18000,
          volume: 42,
          containerType: '40ft Standard',
          quantity: 2
        },
        dates: {
          bookingDate: new Date('2024-02-01'),
          departureDate: new Date('2024-02-10'),
          estimatedArrival: new Date('2024-03-05'),
          actualArrival: null
        },
        supplier: suppliers[0]._id,
        totalCost: 15000,
        currency: 'USD'
      }
    ]);

    console.log('✅ Created 4 shipments\n');

    // ==================== CREATE CONTAINERS ====================
    console.log('📦 Creating sample containers...');

    const shipments = await Shipment.find();

    await Container.create([
      {
        containerId: 'CNT-001',
        containerNumber: 'MSCU1234567',
        type: '40ft_standard',
        status: 'in_use',
        location: 'In Transit - Shanghai to Colombo',
        currentShipment: shipments[0]._id,
        condition: 'good',
        lastInspectionDate: new Date('2024-01-10'),
        purchaseDate: new Date('2020-05-15'),
        purchasePrice: 4500
      },
      {
        containerId: 'CNT-002',
        containerNumber: 'MSCU7654321',
        type: '40ft_standard',
        status: 'in_use',
        location: 'In Transit - Shanghai to Colombo',
        currentShipment: shipments[0]._id,
        condition: 'excellent',
        lastInspectionDate: new Date('2024-01-12'),
        purchaseDate: new Date('2021-03-20'),
        purchasePrice: 4800
      },
      {
        containerId: 'CNT-003',
        containerNumber: 'HLCU9876543',
        type: '20ft_standard',
        status: 'in_use',
        location: 'Customs Clearance - Colombo',
        currentShipment: shipments[1]._id,
        condition: 'good',
        lastInspectionDate: new Date('2024-01-08'),
        purchaseDate: new Date('2019-11-10'),
        purchasePrice: 2800
      },
      {
        containerId: 'CNT-004',
        containerNumber: 'SEGU5555555',
        type: '40ft_high_cube',
        status: 'available',
        location: 'Colombo Container Yard',
        currentShipment: null,
        condition: 'excellent',
        lastInspectionDate: new Date('2024-01-20'),
        purchaseDate: new Date('2022-08-05'),
        purchasePrice: 5200
      },
      {
        containerId: 'CNT-005',
        containerNumber: 'CSNU8888888',
        type: '40ft_standard',
        status: 'available',
        location: 'Colombo Container Yard',
        currentShipment: null,
        condition: 'good',
        lastInspectionDate: new Date('2024-01-18'),
        purchaseDate: new Date('2021-06-12'),
        purchasePrice: 4600
      },
      {
        containerId: 'CNT-006',
        containerNumber: 'TEMU3333333',
        type: '20ft_refrigerated',
        status: 'maintenance',
        location: 'Maintenance Facility - Colombo',
        currentShipment: null,
        condition: 'fair',
        lastInspectionDate: new Date('2024-01-25'),
        purchaseDate: new Date('2018-04-22'),
        purchasePrice: 8500
      }
    ]);

    console.log('✅ Created 6 containers\n');

    // ==================== CREATE INVOICES ====================
    console.log('💰 Creating sample invoices...');

    await Invoice.create([
      {
        invoiceId: 'INV-001',
        invoiceNumber: 'CCT-INV-2024-001',
        client: demoClient._id,
        shipment: shipments[2]._id,
        issueDate: new Date('2024-01-18'),
        dueDate: new Date('2024-02-17'),
        status: 'paid',
        items: [
          {
            description: 'Ocean Freight - Singapore to Colombo',
            quantity: 2,
            unitPrice: 5000,
            amount: 10000
          },
          {
            description: 'Container Handling',
            quantity: 2,
            unitPrice: 500,
            amount: 1000
          },
          {
            description: 'Documentation Fee',
            quantity: 1,
            unitPrice: 200,
            amount: 200
          }
        ],
        subtotal: 11200,
        tax: 800,
        total: 12000,
        currency: 'USD',
        paymentMethod: 'Bank Transfer',
        paidDate: new Date('2024-01-30'),
        notes: 'Payment received on time. Thank you for your business.'
      },
      {
        invoiceId: 'INV-002',
        invoiceNumber: 'CCT-INV-2024-002',
        client: demoClient._id,
        shipment: shipments[0]._id,
        issueDate: new Date('2024-01-21'),
        dueDate: new Date('2024-02-20'),
        status: 'sent',
        items: [
          {
            description: 'Ocean Freight - Shanghai to Colombo',
            quantity: 2,
            unitPrice: 3500,
            amount: 7000
          },
          {
            description: 'Insurance',
            quantity: 1,
            unitPrice: 800,
            amount: 800
          },
          {
            description: 'Port Charges',
            quantity: 1,
            unitPrice: 400,
            amount: 400
          }
        ],
        subtotal: 8200,
        tax: 300,
        total: 8500,
        currency: 'USD',
        paymentMethod: null,
        paidDate: null,
        notes: 'Payment due within 30 days of invoice date.'
      },
      {
        invoiceId: 'INV-003',
        invoiceNumber: 'CCT-INV-2024-003',
        client: demoClient._id,
        shipment: shipments[1]._id,
        issueDate: new Date('2024-01-26'),
        dueDate: new Date('2024-02-25'),
        status: 'sent',
        items: [
          {
            description: 'Air Freight - Dubai to Colombo',
            quantity: 1,
            unitPrice: 3500,
            amount: 3500
          },
          {
            description: 'Customs Clearance',
            quantity: 1,
            unitPrice: 500,
            amount: 500
          },
          {
            description: 'Ground Transport',
            quantity: 1,
            unitPrice: 150,
            amount: 150
          }
        ],
        subtotal: 4150,
        tax: 50,
        total: 4200,
        currency: 'USD',
        paymentMethod: null,
        paidDate: null,
        notes: 'Shipment currently in customs clearance.'
      }
    ]);

    console.log('✅ Created 3 invoices\n');

    // ==================== SUMMARY ====================
    console.log('🎉 Additional seed completed successfully!\n');
    console.log('='.repeat(60));
    console.log('📋 ADDITIONAL DATA SUMMARY');
    console.log('='.repeat(60));
    console.log('\n✅ Created Collections:');
    console.log('   • 3 Suppliers (ocean freight, air freight, customs)');
    console.log('   • 4 Shipments (pending, in_transit, customs, delivered)');
    console.log('   • 6 Containers (various types and statuses)');
    console.log('   • 3 Invoices (paid, sent)');
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database is fully populated for testing!');
    console.log('🚀 You can now test all features of the application\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Additional seed failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedAdditional();
