const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configure DNS to use Google's public DNS servers for SRV record lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import models
const User = require('../src/models/User');
const Role = require('../src/models/Role');
const Client = require('../src/models/Client');
const Supplier = require('../src/models/Supplier');
const Container = require('../src/models/Container');
const Shipment = require('../src/models/Shipment');
const Expense = require('../src/models/Expense');
const Income = require('../src/models/Income');
const ExpenseCategory = require('../src/models/ExpenseCategory');
const IncomeSource = require('../src/models/IncomeSource');

// Helper function to generate random dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function seed() {
  try {
    console.log('🌱 Starting ENHANCED database seed...\n');

    // Connect to MongoDB with explicit database name
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');
    await mongoose.connect(mongoURI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Client.deleteMany({});
    await Supplier.deleteMany({});
    await Container.deleteMany({});
    await Shipment.deleteMany({});
    await Expense.deleteMany({});
    await Income.deleteMany({});
    await ExpenseCategory.deleteMany({});
    await IncomeSource.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // ==================== CREATE ROLES ====================
    console.log('📝 Creating roles...');

    const superAdminRole = await Role.create({
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Super Admin with full unrestricted access to everything',
      userType: 'admin',
      permissions: ['*'],
      isSystem: true
    });

    const adminRole = await Role.create({
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access - Can manage all aspects of the system',
      userType: 'admin',
      permissions: [
        'users:read', 'users:write', 'users:permissions',
        'roles:read', 'roles:write',
        'shipments:read', 'shipments:write',
        'containers:read', 'containers:write',
        'clients:read', 'clients:write',
        'suppliers:read', 'suppliers:write',
        'tracking:read', 'tracking:write',
        'reports:read', 'reports:write',
        'invoices:read', 'invoices:write',
        'financials:read', 'financials:write',
        'support:read', 'support:write',
        'settings:read', 'settings:write',
        'profile:read', 'profile:write'
      ],
      isSystem: true
    });

    const managerRole = await Role.create({
      name: 'manager',
      displayName: 'Manager',
      description: 'Operations manager - Can manage shipments and clients',
      userType: 'admin',
      permissions: [
        'users:read',
        'shipments:read', 'shipments:write',
        'containers:read', 'containers:write',
        'clients:read', 'clients:write',
        'suppliers:read',
        'tracking:read', 'tracking:write',
        'reports:read',
        'invoices:read', 'invoices:write',
        'financials:read', 'financials:write',
        'support:read', 'support:write',
        'profile:read', 'profile:write'
      ],
      isSystem: true
    });

    const staffRole = await Role.create({
      name: 'staff',
      displayName: 'Staff',
      description: 'Staff member - Can view and update shipments',
      userType: 'admin',
      permissions: [
        'shipments:read', 'shipments:write',
        'containers:read',
        'clients:read',
        'tracking:read', 'tracking:write',
        'financials:read',
        'support:read', 'support:write',
        'profile:read', 'profile:write'
      ],
      isSystem: true
    });

    const clientRole = await Role.create({
      name: 'client',
      displayName: 'Client',
      description: 'Client portal access - Can view own shipments and invoices',
      userType: 'client',
      permissions: [
        'shipments:read:own',
        'invoices:read:own',
        'tracking:read:own',
        'support:read:own', 'support:write',
        'profile:read', 'profile:write'
      ],
      isSystem: true
    });

    console.log('✅ Created 5 roles\n');

    // ==================== CREATE USERS ====================
    console.log('👤 Creating users...');

    const superAdminUser = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@ceylongrp.com',
      password: 'SuperAdmin@123',
      role: superAdminRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
      phone: '+94112345677',
      bio: 'System Super Administrator with full access',
      location: 'Colombo, Sri Lanka',
      jobTitle: 'Super Administrator',
      permissions: { override: [], blocked: [] }
    });

    console.log('✅ Created super admin user\n');

    // ==================== CREATE CLIENTS ====================
    console.log('🏢 Creating clients...');

    const clients = await Client.create([
      {
        companyName: 'Acme Corporation',
        tradingName: 'Acme Corp',
        industry: 'Manufacturing',
        website: 'https://acmecorp.com',
        address: {
          street: '500 Industrial Parkway',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA'
        },
        contactPerson: {
          firstName: 'John',
          lastName: 'Anderson',
          position: 'Supply Chain Director',
          email: 'john.anderson@acmecorp.com',
          phone: '+1-555-0123'
        },
        billingAddress: { sameAsAddress: true },
        paymentTerms: 30,
        creditLimit: 150000,
        currentBalance: 45000,
        status: 'active',
        taxId: 'US123456789',
        registrationNumber: 'REG-US-001',
        tags: ['manufacturing', 'priority', 'usa'],
        preferredCurrency: 'USD'
      },
      {
        companyName: 'Global Traders Ltd',
        tradingName: 'GT Ltd',
        industry: 'Import/Export',
        website: 'https://globaltraders.co.uk',
        address: {
          street: '78 Commerce Road',
          city: 'London',
          state: 'England',
          postalCode: 'EC1A 1BB',
          country: 'United Kingdom'
        },
        contactPerson: {
          firstName: 'Sarah',
          lastName: 'Chen',
          position: 'Logistics Manager',
          email: 'sarah.chen@globaltraders.co.uk',
          phone: '+44-20-7946-0958'
        },
        billingAddress: { sameAsAddress: true },
        paymentTerms: 45,
        creditLimit: 200000,
        currentBalance: 85000,
        status: 'active',
        taxId: 'GB987654321',
        registrationNumber: 'REG-UK-002',
        tags: ['import-export', 'europe'],
        preferredCurrency: 'GBP'
      },
      {
        companyName: 'Tech Import Solutions',
        tradingName: 'TIS',
        industry: 'Technology',
        website: 'https://techimport.sg',
        address: {
          street: '88 Marina Bay',
          city: 'Singapore',
          state: 'Singapore',
          postalCode: '018981',
          country: 'Singapore'
        },
        contactPerson: {
          firstName: 'Michael',
          lastName: 'Wong',
          position: 'CEO',
          email: 'michael.wong@techimport.sg',
          phone: '+65-6789-1234'
        },
        billingAddress: { sameAsAddress: true },
        paymentTerms: 60,
        creditLimit: 300000,
        currentBalance: 120000,
        status: 'active',
        taxId: 'SG456789123',
        registrationNumber: 'REG-SG-003',
        tags: ['technology', 'asia', 'high-value'],
        preferredCurrency: 'SGD'
      },
      {
        companyName: 'Pacific Electronics Trading',
        tradingName: 'PET Co',
        industry: 'Electronics',
        website: 'https://pacelectronics.jp',
        address: {
          street: '3-1-1 Marunouchi',
          city: 'Tokyo',
          state: 'Tokyo',
          postalCode: '100-0005',
          country: 'Japan'
        },
        contactPerson: {
          firstName: 'Kenji',
          lastName: 'Yamamoto',
          position: 'Trading Director',
          email: 'k.yamamoto@pacelectronics.jp',
          phone: '+81-3-1234-5678'
        },
        billingAddress: { sameAsAddress: true },
        paymentTerms: 60,
        creditLimit: 350000,
        currentBalance: 180000,
        status: 'active',
        taxId: 'JP987123456',
        registrationNumber: 'REG-JP-006',
        tags: ['electronics', 'high-volume'],
        preferredCurrency: 'JPY'
      },
      {
        companyName: 'Australian Imports Co',
        tradingName: 'AIC',
        industry: 'Retail',
        website: 'https://ausimports.com.au',
        address: {
          street: '200 Collins Street',
          city: 'Melbourne',
          state: 'Victoria',
          postalCode: '3000',
          country: 'Australia'
        },
        contactPerson: {
          firstName: 'David',
          lastName: 'Thompson',
          position: 'Operations Manager',
          email: 'd.thompson@ausimports.com.au',
          phone: '+61-3-9876-5432'
        },
        billingAddress: { sameAsAddress: true },
        paymentTerms: 30,
        creditLimit: 120000,
        currentBalance: 35000,
        status: 'active',
        taxId: 'AU753951456',
        registrationNumber: 'REG-AU-009',
        tags: ['retail', 'oceania'],
        preferredCurrency: 'AUD'
      }
    ]);

    console.log(`✅ Created ${clients.length} clients\n`);

    // ==================== CREATE SUPPLIERS ====================
    console.log('🚢 Creating suppliers...');

    const suppliers = await Supplier.create([
      {
        companyName: 'Maritime Shipping Lines',
        tradingName: 'MSL',
        serviceTypes: ['ocean_freight'],
        contactPerson: {
          firstName: 'Captain',
          lastName: 'Rodriguez',
          position: 'Operations Manager',
          email: 'j.rodriguez@maritimelines.com',
          phone: '+1-555-0186'
        },
        address: {
          street: '789 Harbor Boulevard',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'USA'
        },
        banking: {
          bankName: 'Chase Bank',
          swiftCode: 'CHASUS33',
          accountName: 'Maritime Shipping Lines Inc',
          accountNumber: '****5678'
        },
        status: 'active',
        rating: 5.0,
        paymentTerms: 'net_30',
        tags: ['reliable', 'ocean'],
        performanceMetrics: {
          totalShipments: 156,
          activeContracts: 8,
          onTimeRate: 98
        }
      },
      {
        companyName: 'Global Container Services',
        tradingName: 'GCS',
        serviceTypes: ['container', 'warehouse'],
        contactPerson: {
          firstName: 'Linda',
          lastName: 'Zhang',
          position: 'Account Manager',
          email: 'l.zhang@globalcontainer.com',
          phone: '+86-21-5555-8888'
        },
        address: {
          street: '456 Industrial Park Road',
          city: 'Shanghai',
          state: 'Shanghai',
          postalCode: '200000',
          country: 'China'
        },
        banking: {
          bankName: 'ICBC',
          swiftCode: 'ICBKCNBJ',
          accountName: 'Global Container Services Ltd',
          accountNumber: '****3456'
        },
        status: 'active',
        rating: 4.9,
        paymentTerms: 'net_45',
        tags: ['containers', 'storage'],
        performanceMetrics: {
          totalShipments: 243,
          activeContracts: 12,
          onTimeRate: 96
        }
      },
      {
        companyName: 'SkyWings Cargo',
        tradingName: 'SkyWings',
        serviceTypes: ['air_sea', 'express'],
        contactPerson: {
          firstName: 'Sarah',
          lastName: 'Williams',
          position: 'Cargo Director',
          email: 's.williams@skywings.com',
          phone: '+44-20-5555-4321'
        },
        address: {
          street: '100 Airport Road',
          city: 'London',
          state: 'England',
          postalCode: 'LHR 2AB',
          country: 'United Kingdom'
        },
        banking: {
          bankName: 'Barclays Bank',
          swiftCode: 'BARCGB22',
          accountName: 'SkyWings Cargo Ltd',
          accountNumber: '****8901'
        },
        status: 'active',
        rating: 4.8,
        paymentTerms: 'net_15',
        tags: ['air', 'express', 'premium'],
        performanceMetrics: {
          totalShipments: 134,
          activeContracts: 6,
          onTimeRate: 97
        }
      }
    ]);

    console.log(`✅ Created ${suppliers.length} suppliers\n`);

    // ==================== CREATE CONTAINERS ====================
    console.log('📦 Creating containers...');

    const containerTypes = ['20ft_standard', '40ft_standard', '40ft_high_cube', '20ft_refrigerated', '40ft_refrigerated'];
    const containerLocations = ['Colombo Port', 'Shanghai Port', 'Singapore Port', 'Dubai Port', 'Hamburg Port', 'Los Angeles Port'];
    const containerConditions = ['excellent', 'good', 'fair'];

    const containers = [];
    for (let i = 1; i <= 20; i++) {
      containers.push({
        containerNumber: `CCTU${String(i).padStart(7, '0')}`,
        type: containerTypes[Math.floor(Math.random() * containerTypes.length)],
        status: 'available',
        location: containerLocations[Math.floor(Math.random() * containerLocations.length)],
        condition: containerConditions[Math.floor(Math.random() * containerConditions.length)],
        lastInspectionDate: randomDate(new Date(2025, 6, 1), new Date(2026, 0, 1)),
        purchaseDate: randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
        purchasePrice: 2800 + Math.floor(Math.random() * 5000)
      });
    }

    const createdContainers = await Container.create(containers);
    console.log(`✅ Created ${createdContainers.length} containers\n`);

    // ==================== INITIALIZE FINANCIAL CATEGORIES ====================
    console.log('💰 Initializing financial categories...');
    await ExpenseCategory.initializeDefaultCategories();
    await IncomeSource.initializeDefaultSources();
    console.log('✅ Initialized financial categories\n');

    // ==================== CREATE SHIPMENTS WITH FINANCIAL DATA ====================
    console.log('📦 Creating comprehensive shipments across 2025-2026...\n');

    const shipmentStatuses = ['booked', 'in_transit', 'customs', 'delivered'];
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

    const shipments = [];
    const incomes = [];
    const expenses = [];
    let shipmentCounter = 0;

    // Create shipments for 2025 (Q3 and Q4)
    const shipmentsIn2025 = 25;
    for (let i = 0; i < shipmentsIn2025; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const container = createdContainers[shipmentCounter % createdContainers.length];

      const bookingDate = randomDate(new Date(2025, 6, 1), new Date(2025, 11, 31));
      const departureDate = addDays(bookingDate, 3 + Math.floor(Math.random() * 7));
      const transitDays = 15 + Math.floor(Math.random() * 25);
      const estimatedArrival = addDays(departureDate, transitDays);

      // 80% chance of on-time delivery, 20% chance of delay
      const isOnTime = Math.random() > 0.2;
      const actualArrival = isOnTime
        ? addDays(estimatedArrival, -Math.floor(Math.random() * 3))
        : addDays(estimatedArrival, 1 + Math.floor(Math.random() * 7));

      const status = actualArrival < new Date() ? 'delivered' :
                     departureDate < new Date() ? 'in_transit' : 'booked';

      const totalCost = 3000 + Math.floor(Math.random() * 12000);

      shipments.push({
        client: client._id,
        supplier: supplier._id,
        route: {
          origin: origins[Math.floor(Math.random() * origins.length)],
          destination: destinations[Math.floor(Math.random() * destinations.length)]
        },
        status,
        cargo: {
          description: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
          weight: 5000 + Math.floor(Math.random() * 20000),
          volume: 20 + Math.floor(Math.random() * 50),
          quantity: 50 + Math.floor(Math.random() * 300),
          containerType: container.type
        },
        dates: {
          bookingDate,
          departureDate,
          estimatedArrival,
          ...(status === 'delivered' && { actualArrival })
        },
        totalCost,
        currency: 'USD',
        createdAt: bookingDate
      });

      // Create income for this shipment (freight charges)
      incomes.push({
        source: 'freight_charges',
        description: `Shipment revenue - ${cargoTypes[Math.floor(Math.random() * cargoTypes.length)]}`,
        amount: totalCost,
        currency: 'USD',
        date: bookingDate,
        paymentMethod: Math.random() > 0.5 ? 'Bank Transfer' : 'Credit Card',
        status: status === 'delivered' ? 'received' : 'pending',
        amountReceived: status === 'delivered' ? totalCost : 0,
        createdBy: superAdminUser._id,
        createdAt: bookingDate
      });

      // Create expenses for this shipment
      if (status === 'delivered' || status === 'in_transit') {
        expenses.push({
          category: 'fuel',
          description: `Fuel costs for shipment`,
          amount: Math.floor(totalCost * 0.15),
          currency: 'USD',
          date: departureDate,
          paymentMethod: 'Bank Transfer',
          status: 'paid',
          createdBy: superAdminUser._id,
          createdAt: departureDate
        });

        expenses.push({
          category: 'port_fees',
          description: `Port handling charges`,
          amount: Math.floor(totalCost * 0.08),
          currency: 'USD',
          date: departureDate,
          paymentMethod: 'Credit Card',
          status: 'paid',
          createdBy: superAdminUser._id,
          createdAt: departureDate
        });
      }

      shipmentCounter++;
    }

    // Create shipments for 2026 (Q1)
    const shipmentsIn2026 = 20;
    for (let i = 0; i < shipmentsIn2026; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const container = createdContainers[shipmentCounter % createdContainers.length];

      const bookingDate = randomDate(new Date(2026, 0, 1), new Date(2026, 0, 31));
      const departureDate = addDays(bookingDate, 3 + Math.floor(Math.random() * 7));
      const transitDays = 15 + Math.floor(Math.random() * 25);
      const estimatedArrival = addDays(departureDate, transitDays);

      const today = new Date();
      const isOnTime = Math.random() > 0.2;
      const actualArrival = isOnTime
        ? addDays(estimatedArrival, -Math.floor(Math.random() * 3))
        : addDays(estimatedArrival, 1 + Math.floor(Math.random() * 7));

      const status = actualArrival < today ? 'delivered' :
                     departureDate < today ? 'in_transit' : 'booked';

      const totalCost = 3000 + Math.floor(Math.random() * 12000);

      shipments.push({
        client: client._id,
        supplier: supplier._id,
        route: {
          origin: origins[Math.floor(Math.random() * origins.length)],
          destination: destinations[Math.floor(Math.random() * destinations.length)]
        },
        status,
        cargo: {
          description: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
          weight: 5000 + Math.floor(Math.random() * 20000),
          volume: 20 + Math.floor(Math.random() * 50),
          quantity: 50 + Math.floor(Math.random() * 300),
          containerType: container.type
        },
        dates: {
          bookingDate,
          departureDate,
          estimatedArrival,
          ...(status === 'delivered' && { actualArrival })
        },
        totalCost,
        currency: 'USD',
        createdAt: bookingDate
      });

      // Create income for this shipment
      incomes.push({
        source: 'freight_charges',
        description: `Shipment revenue - ${cargoTypes[Math.floor(Math.random() * cargoTypes.length)]}`,
        amount: totalCost,
        currency: 'USD',
        date: bookingDate,
        paymentMethod: Math.random() > 0.5 ? 'Bank Transfer' : 'Credit Card',
        status: status === 'delivered' ? 'received' : 'pending',
        amountReceived: status === 'delivered' ? totalCost : 0,
        createdBy: superAdminUser._id,
        createdAt: bookingDate
      });

      // Create expenses
      if (status === 'delivered' || status === 'in_transit') {
        expenses.push({
          category: 'fuel',
          description: `Fuel costs for shipment`,
          amount: Math.floor(totalCost * 0.15),
          currency: 'USD',
          date: departureDate,
          paymentMethod: 'Bank Transfer',
          status: 'paid',
          createdBy: superAdminUser._id,
          createdAt: departureDate
        });

        expenses.push({
          category: 'port_fees',
          description: `Port handling charges`,
          amount: Math.floor(totalCost * 0.08),
          currency: 'USD',
          date: departureDate,
          paymentMethod: 'Credit Card',
          status: 'paid',
          createdBy: superAdminUser._id,
          createdAt: departureDate
        });
      }

      shipmentCounter++;
    }

    const createdShipments = await Shipment.create(shipments);
    console.log(`✅ Created ${createdShipments.length} shipments (${shipmentsIn2025} in 2025, ${shipmentsIn2026} in 2026)\n`);

    // Create income and expense records
    const createdIncomes = await Income.create(incomes);
    const createdExpenses = await Expense.create(expenses);
    console.log(`✅ Created ${createdIncomes.length} income records\n`);
    console.log(`✅ Created ${createdExpenses.length} expense records\n`);

    // Add operational expenses (monthly salaries, utilities, etc.)
    const operationalExpenses = [];

    // 2025 monthly expenses
    for (let month = 6; month < 12; month++) {
      operationalExpenses.push({
        category: 'staff_salaries',
        description: 'Monthly staff salaries',
        amount: 15000 + Math.floor(Math.random() * 5000),
        currency: 'USD',
        date: new Date(2025, month, 1),
        paymentMethod: 'Bank Transfer',
        status: 'paid',
        createdBy: superAdminUser._id
      });

      operationalExpenses.push({
        category: 'utilities',
        description: 'Office utilities and services',
        amount: 2000 + Math.floor(Math.random() * 1000),
        currency: 'USD',
        date: new Date(2025, month, 5),
        paymentMethod: 'Bank Transfer',
        status: 'paid',
        createdBy: superAdminUser._id
      });
    }

    // 2026 monthly expenses (January only)
    operationalExpenses.push({
      category: 'staff_salaries',
      description: 'Monthly staff salaries - January',
      amount: 18000,
      currency: 'USD',
      date: new Date(2026, 0, 1),
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    operationalExpenses.push({
      category: 'utilities',
      description: 'Office utilities - January',
      amount: 2500,
      currency: 'USD',
      date: new Date(2026, 0, 5),
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Expense.create(operationalExpenses);
    console.log(`✅ Created ${operationalExpenses.length} operational expense records\n`);

    // Update some containers to be in_use
    const inUseShipments = createdShipments.filter(s => s.status === 'in_transit').slice(0, 5);
    for (let i = 0; i < inUseShipments.length && i < 5; i++) {
      await Container.findByIdAndUpdate(createdContainers[i]._id, {
        status: 'in_use',
        currentShipment: inUseShipments[i]._id,
        location: 'Pacific Ocean'
      });
    }

    console.log('✅ Updated container statuses\n');

    // ==================== SUMMARY ====================
    console.log('🎉 Enhanced seed completed successfully!\n');
    console.log('='.repeat(60));
    console.log('📋 DATABASE SUMMARY');
    console.log('='.repeat(60));

    console.log('\n✅ Login Credentials:');
    console.log('   Email: superadmin@ceylongrp.com');
    console.log('   Password: SuperAdmin@123');

    console.log('\n✅ Created Data:');
    console.log(`   • ${clients.length} Clients (all active)`);
    console.log(`   • ${suppliers.length} Suppliers (all active)`);
    console.log(`   • ${createdContainers.length} Containers`);
    console.log(`   • ${createdShipments.length} Shipments`);
    console.log(`   • ${createdIncomes.length} Income Records`);
    console.log(`   • ${createdExpenses.length + operationalExpenses.length} Expense Records`);

    console.log('\n✅ Shipment Distribution:');
    console.log(`   • Delivered: ${createdShipments.filter(s => s.status === 'delivered').length}`);
    console.log(`   • In Transit: ${createdShipments.filter(s => s.status === 'in_transit').length}`);
    console.log(`   • Booked: ${createdShipments.filter(s => s.status === 'booked').length}`);

    console.log('\n✅ Financial Summary:');
    const totalIncome = createdIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = [...createdExpenses, ...operationalExpenses].reduce((sum, e) => sum + e.amount, 0);
    console.log(`   • Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`   • Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`   • Net Profit: $${(totalIncome - totalExpenses).toFixed(2)}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database is ready for comprehensive reporting!');
    console.log('🚀 Start the API server and generate reports!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seed();
