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

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB with explicit database name
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');
    await mongoose.connect(mongoURI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - comment out in production)
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

    // Super Admin with wildcard permissions
    const superAdminRole = await Role.create({
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Super Admin with full unrestricted access to everything',
      userType: 'admin',
      permissions: ['*'], // Wildcard = all permissions
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

    console.log('✅ Created 5 roles (super_admin, admin, manager, staff, client)\n');

    // ==================== CREATE SUPER ADMIN USER ====================
    console.log('👤 Creating super admin user...');

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
      bio: 'System Super Administrator with full access to all features and settings',
      location: 'Colombo, Sri Lanka',
      jobTitle: 'Super Administrator',
      companyInfo: {
        companyName: 'Ceylon Cargo Transport',
        companyEmail: 'info@ceyloncargo.lk',
        companyPhone: '+94 11 234 5678',
        companyAddress: '123 Marine Drive, Fort, Colombo 01, Sri Lanka',
        website: 'www.ceyloncargo.lk',
        taxId: 'CCT-2024-001',
        updatedAt: new Date()
      },
      notificationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        shipmentUpdates: true,
        invoiceAlerts: true,
        systemUpdates: true,
        newsletter: false,
        updatedAt: new Date()
      },
      systemPreferences: {
        language: 'English',
        timezone: 'Asia/Phnom_Penh (UTC+7:00)',
        dateFormat: 'DD/MM/YYYY',
        currency: 'USD ($)',
        updatedAt: new Date()
      },
      permissions: {
        override: [],
        blocked: []
      }
    });

    console.log('✅ Created super admin user\n');

    // ==================== CREATE ADMIN USER ====================
    console.log('👤 Creating admin user...');

    const adminUser = await User.create({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@ceylongrp.com',
      password: 'Admin@123',
      role: adminRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
      phone: '+94112345678',
      bio: 'System Administrator',
      location: 'Colombo, Sri Lanka',
      jobTitle: 'System Administrator',
      notificationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        shipmentUpdates: true,
        invoiceAlerts: true,
        systemUpdates: true,
        newsletter: false,
        updatedAt: new Date()
      },
      systemPreferences: {
        language: 'English',
        timezone: 'Asia/Phnom_Penh (UTC+7:00)',
        dateFormat: 'DD/MM/YYYY',
        currency: 'USD ($)',
        updatedAt: new Date()
      },
      permissions: {
        override: [],
        blocked: []
      }
    });

    console.log('✅ Created admin user\n');

    // ==================== CREATE SAMPLE STAFF USERS ====================
    console.log('👥 Creating sample staff users...');

    await User.create({
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@ceylongrp.com',
      password: 'Manager@123',
      role: managerRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
      phone: '+94112345679',
      permissions: {
        override: [],
        blocked: []
      }
    });

    await User.create({
      firstName: 'Jane',
      lastName: 'Staff',
      email: 'staff@ceylongrp.com',
      password: 'Staff@123',
      role: staffRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
      phone: '+94112345680',
      permissions: {
        override: [],
        blocked: []
      }
    });

    console.log('✅ Created 2 staff users (manager, staff)\n');

    // ==================== CREATE SAMPLE CLIENT ====================
    console.log('🏢 Creating sample client...');

    const clientUser = await User.create({
      firstName: 'Demo',
      lastName: 'Client',
      email: 'client@example.com',
      password: 'Client@123',
      role: clientRole._id,
      userType: 'client',
      status: 'active',
      emailVerified: true,
      phone: '+94771234567',
      permissions: {
        override: [],
        blocked: []
      }
    });

    // ==================== CREATE SAMPLE CLIENTS ====================
    console.log('🏢 Creating sample clients...');

    await Client.create({
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
        phone: '+1-555-0123',
        alternatePhone: '+1-555-0124'
      },
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 30,
      creditLimit: 150000,
      currentBalance: 45000,
      status: 'active',
      taxId: 'US123456789',
      registrationNumber: 'REG-US-001',
      tags: ['manufacturing', 'priority', 'usa'],
      notes: 'Long-term client with excellent payment history',
      preferredCurrency: 'USD'
    });

    await Client.create({
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
      billingAddress: {
        street: '78 Commerce Road',
        city: 'London',
        state: 'England',
        postalCode: 'EC1A 1BB',
        country: 'United Kingdom',
        sameAsAddress: true
      },
      paymentTerms: 45,
      creditLimit: 200000,
      currentBalance: 85000,
      status: 'active',
      taxId: 'GB987654321',
      registrationNumber: 'REG-UK-002',
      tags: ['import-export', 'europe'],
      notes: 'High volume client, requires priority handling',
      preferredCurrency: 'GBP'
    });

    await Client.create({
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
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 60,
      creditLimit: 300000,
      currentBalance: 120000,
      status: 'active',
      taxId: 'SG456789123',
      registrationNumber: 'REG-SG-003',
      tags: ['technology', 'asia', 'high-value'],
      notes: 'Premium client specializing in electronics imports',
      preferredCurrency: 'SGD'
    });

    await Client.create({
      companyName: 'Fashion Imports Inc',
      tradingName: 'Fashion Inc',
      industry: 'Fashion & Apparel',
      website: 'https://fashionimports.it',
      address: {
        street: '45 Via della Moda',
        city: 'Milan',
        state: 'Lombardy',
        postalCode: '20121',
        country: 'Italy'
      },
      contactPerson: {
        firstName: 'Isabella',
        lastName: 'Rossi',
        position: 'Import Director',
        email: 'i.rossi@fashionimports.it',
        phone: '+39-02-1234-5678'
      },
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 30,
      creditLimit: 100000,
      currentBalance: 25000,
      status: 'active',
      taxId: 'IT789456123',
      registrationNumber: 'REG-IT-004',
      tags: ['fashion', 'seasonal'],
      notes: 'Seasonal shipments, peak season Mar-Sep',
      preferredCurrency: 'EUR'
    });

    await Client.create({
      companyName: 'Automotive Parts Global',
      tradingName: 'APG',
      industry: 'Automotive',
      website: 'https://autopartsglobal.de',
      address: {
        street: '120 Industriestraße',
        city: 'Hamburg',
        state: 'Hamburg',
        postalCode: '20095',
        country: 'Germany'
      },
      contactPerson: {
        firstName: 'Hiroshi',
        lastName: 'Tanaka',
        position: 'Procurement Manager',
        email: 'h.tanaka@autopartsglobal.de',
        phone: '+49-40-1234-5678'
      },
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 45,
      creditLimit: 250000,
      currentBalance: 0,
      status: 'inactive',
      taxId: 'DE321654987',
      registrationNumber: 'REG-DE-005',
      tags: ['automotive', 'industrial'],
      notes: 'Account on hold - pending contract renewal',
      preferredCurrency: 'EUR'
    });

    await Client.create({
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
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 60,
      creditLimit: 350000,
      currentBalance: 180000,
      status: 'active',
      taxId: 'JP987123456',
      registrationNumber: 'REG-JP-006',
      tags: ['electronics', 'high-volume'],
      notes: 'Weekly shipments, requires custom packaging',
      preferredCurrency: 'JPY'
    });

    await Client.create({
      companyName: 'Middle East Trading Hub',
      tradingName: 'METH',
      industry: 'General Trading',
      website: 'https://metradinghub.ae',
      address: {
        street: '789 Sheikh Zayed Road',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '00000',
        country: 'UAE'
      },
      contactPerson: {
        firstName: 'Ahmed',
        lastName: 'Al-Maktoum',
        position: 'General Manager',
        email: 'ahmed.almaktoum@metradinghub.ae',
        phone: '+971-4-123-4567'
      },
      billingAddress: {
        street: 'PO Box 12345',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '00000',
        country: 'UAE',
        sameAsAddress: false
      },
      paymentTerms: 30,
      creditLimit: 180000,
      currentBalance: 65000,
      status: 'active',
      taxId: 'UAE654321987',
      registrationNumber: 'REG-UAE-007',
      tags: ['trading', 'middle-east'],
      notes: 'Handles re-export to neighboring countries',
      preferredCurrency: 'USD'
    });

    await Client.create({
      companyName: 'Pharma Logistics International',
      tradingName: 'PLI',
      industry: 'Pharmaceuticals',
      website: 'https://pharmalogistics.ch',
      address: {
        street: '56 Bahnhofstrasse',
        city: 'Zurich',
        state: 'Zurich',
        postalCode: '8001',
        country: 'Switzerland'
      },
      contactPerson: {
        firstName: 'Dr. Emma',
        lastName: 'Schmidt',
        position: 'Supply Chain Head',
        email: 'e.schmidt@pharmalogistics.ch',
        phone: '+41-44-123-4567'
      },
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 90,
      creditLimit: 500000,
      currentBalance: 220000,
      status: 'active',
      taxId: 'CH159753486',
      registrationNumber: 'REG-CH-008',
      tags: ['pharma', 'temperature-controlled', 'compliance'],
      notes: 'Requires temperature-controlled shipping and full compliance documentation',
      preferredCurrency: 'CHF'
    });

    await Client.create({
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
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 30,
      creditLimit: 120000,
      currentBalance: 35000,
      status: 'active',
      taxId: 'AU753951456',
      registrationNumber: 'REG-AU-009',
      tags: ['retail', 'oceania'],
      notes: 'Bi-weekly container shipments',
      preferredCurrency: 'AUD'
    });

    await Client.create({
      companyName: 'Green Energy Solutions',
      tradingName: 'GES',
      industry: 'Renewable Energy',
      website: 'https://greenenergysol.com',
      address: {
        street: '15 Innovation Drive',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'USA'
      },
      contactPerson: {
        firstName: 'Maria',
        lastName: 'Garcia',
        position: 'Procurement Lead',
        email: 'm.garcia@greenenergysol.com',
        phone: '+1-415-555-0199'
      },
      billingAddress: {
        sameAsAddress: true
      },
      paymentTerms: 15,
      creditLimit: 80000,
      currentBalance: 0,
      status: 'suspended',
      taxId: 'US789456123',
      registrationNumber: 'REG-US-010',
      tags: ['renewable', 'new'],
      notes: 'Account suspended - pending payment resolution',
      preferredCurrency: 'USD'
    });

    console.log('✅ Created 10 sample clients\n');

    // ==================== CREATE SAMPLE SUPPLIERS ====================
    console.log('🚢 Creating sample suppliers...');

    await Supplier.create({
      name: 'Maritime Shipping Lines',
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
      notes: 'Premier ocean freight partner with excellent track record',
      performanceMetrics: {
        totalShipments: 156,
        activeContracts: 8,
        onTimeRate: 98
      }
    });

    await Supplier.create({
      name: 'Global Container Services',
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
      notes: 'Large container leasing and warehousing provider',
      performanceMetrics: {
        totalShipments: 243,
        activeContracts: 12,
        onTimeRate: 96
      }
    });

    await Supplier.create({
      name: 'Atlantic Port Solutions',
      tradingName: 'APS',
      serviceTypes: ['port_ops', 'customs'],
      contactPerson: {
        firstName: 'David',
        lastName: 'O\'Connor',
        position: 'Port Director',
        email: 'd.oconnor@atlanticport.com',
        phone: '+353-1-555-0123'
      },
      address: {
        street: '12 Docklands Quay',
        city: 'Dublin',
        state: 'Leinster',
        postalCode: 'D02 X576',
        country: 'Ireland'
      },
      banking: {
        bankName: 'Bank of Ireland',
        swiftCode: 'BOFIIE2D',
        accountName: 'Atlantic Port Solutions Ltd',
        accountNumber: '****7890'
      },
      status: 'active',
      rating: 4.7,
      paymentTerms: 'net_30',
      tags: ['port', 'customs'],
      notes: 'Comprehensive port and customs clearance services',
      performanceMetrics: {
        totalShipments: 89,
        activeContracts: 5,
        onTimeRate: 94
      }
    });

    await Supplier.create({
      name: 'FastLog Trucking',
      tradingName: 'FastLog',
      serviceTypes: ['ground'],
      contactPerson: {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        position: 'Fleet Manager',
        email: 'a.hassan@fastlog.ae',
        phone: '+971-4-555-7890'
      },
      address: {
        street: '45 Logistics Avenue',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '00000',
        country: 'UAE'
      },
      banking: {
        bankName: 'Emirates NBD',
        swiftCode: 'EBILAEAD',
        accountName: 'FastLog Transport LLC',
        accountNumber: '****2345'
      },
      status: 'inactive',
      rating: 4.3,
      paymentTerms: 'net_30',
      tags: ['trucking', 'ground'],
      notes: 'Ground transportation partner - currently under review',
      performanceMetrics: {
        totalShipments: 67,
        activeContracts: 0,
        onTimeRate: 88
      }
    });

    await Supplier.create({
      name: 'SkyWings Cargo',
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
      notes: 'Premium air freight and express delivery services',
      performanceMetrics: {
        totalShipments: 134,
        activeContracts: 6,
        onTimeRate: 97
      }
    });

    await Supplier.create({
      name: 'Pacific Customs Brokers',
      tradingName: 'PCB',
      serviceTypes: ['customs'],
      contactPerson: {
        firstName: 'Kenji',
        lastName: 'Tanaka',
        position: 'Customs Manager',
        email: 'k.tanaka@pacificcustoms.jp',
        phone: '+81-3-5555-6789'
      },
      address: {
        street: '22 Trade Center Building',
        city: 'Tokyo',
        state: 'Tokyo',
        postalCode: '100-0001',
        country: 'Japan'
      },
      banking: {
        bankName: 'Mitsubishi UFJ Bank',
        swiftCode: 'BOTKJPJT',
        accountName: 'Pacific Customs Brokers KK',
        accountNumber: '****4567'
      },
      status: 'active',
      rating: 4.6,
      paymentTerms: 'net_60',
      tags: ['customs', 'documentation'],
      notes: 'Expert customs clearance and trade compliance',
      performanceMetrics: {
        totalShipments: 178,
        activeContracts: 9,
        onTimeRate: 92
      }
    });

    await Supplier.create({
      name: 'EuroTransit Logistics',
      tradingName: 'ETL',
      serviceTypes: ['ground', 'warehouse'],
      contactPerson: {
        firstName: 'Klaus',
        lastName: 'Schmidt',
        position: 'Operations Director',
        email: 'k.schmidt@eurotransit.de',
        phone: '+49-40-5555-3456'
      },
      address: {
        street: '88 Industrial Zone',
        city: 'Hamburg',
        state: 'Hamburg',
        postalCode: '20095',
        country: 'Germany'
      },
      banking: {
        bankName: 'Deutsche Bank',
        swiftCode: 'DEUTDEFF',
        accountName: 'EuroTransit Logistics GmbH',
        accountNumber: '****6789'
      },
      status: 'active',
      rating: 4.5,
      paymentTerms: 'net_45',
      tags: ['european', 'logistics'],
      notes: 'Comprehensive European logistics solutions',
      performanceMetrics: {
        totalShipments: 201,
        activeContracts: 10,
        onTimeRate: 95
      }
    });

    await Supplier.create({
      name: 'QuickShip Express',
      tradingName: 'QuickShip',
      serviceTypes: ['express', 'air_sea'],
      contactPerson: {
        firstName: 'Maria',
        lastName: 'Santos',
        position: 'Account Executive',
        email: 'm.santos@quickship.com.sg',
        phone: '+65-6555-7890'
      },
      address: {
        street: '50 Changi Airport Road',
        city: 'Singapore',
        state: 'Singapore',
        postalCode: '819643',
        country: 'Singapore'
      },
      banking: {
        bankName: 'DBS Bank',
        swiftCode: 'DBSSSGSG',
        accountName: 'QuickShip Express Pte Ltd',
        accountNumber: '****1234'
      },
      status: 'pending',
      rating: 0,
      paymentTerms: 'net_30',
      tags: ['express', 'new'],
      notes: 'New partner under evaluation for express services',
      performanceMetrics: {
        totalShipments: 0,
        activeContracts: 1,
        onTimeRate: 0
      }
    });

    console.log('✅ Created 8 sample suppliers\n');

    // ==================== CREATE SAMPLE CONTAINERS ====================
    console.log('📦 Creating sample containers...');

    // Create shipment first for some containers that are in use
    const shipment1 = await Shipment.create({
      client: (await Client.findOne({ companyName: 'Acme Corporation' }))._id,
      origin: {
        port: 'Port of Shanghai',
        city: 'Shanghai',
        country: 'China'
      },
      destination: {
        port: 'Port of Los Angeles',
        city: 'Los Angeles',
        country: 'USA'
      },
      status: 'in_transit',
      cargo: {
        description: 'Industrial machinery parts',
        weight: 18500,
        volume: 56.2,
        quantity: 150,
        containerType: '40ft_high_cube'
      },
      dates: {
        bookingDate: new Date('2024-01-05'),
        departureDate: new Date('2024-01-10'),
        estimatedArrival: new Date('2024-02-15')
      },
      totalCost: 4500,
      currency: 'USD'
    });

    const shipment2 = await Shipment.create({
      client: (await Client.findOne({ companyName: 'Global Traders Ltd' }))._id,
      origin: {
        port: 'Colombo Port',
        city: 'Colombo',
        country: 'Sri Lanka'
      },
      destination: {
        port: 'Port of London',
        city: 'London',
        country: 'United Kingdom'
      },
      status: 'in_transit',
      cargo: {
        description: 'Tea and spices',
        weight: 15200,
        volume: 45.8,
        quantity: 200,
        containerType: '40ft_standard'
      },
      dates: {
        bookingDate: new Date('2024-01-08'),
        departureDate: new Date('2024-01-12'),
        estimatedArrival: new Date('2024-02-18')
      },
      totalCost: 3800,
      currency: 'GBP'
    });

    const shipment3 = await Shipment.create({
      client: (await Client.findOne({ companyName: 'Tech Import Solutions' }))._id,
      origin: {
        port: 'Port of Singapore',
        city: 'Singapore',
        country: 'Singapore'
      },
      destination: {
        port: 'Port of Tokyo',
        city: 'Tokyo',
        country: 'Japan'
      },
      status: 'in_transit',
      cargo: {
        description: 'Electronics components',
        weight: 12400,
        volume: 38.5,
        quantity: 300,
        containerType: '20ft_refrigerated'
      },
      dates: {
        bookingDate: new Date('2024-01-06'),
        departureDate: new Date('2024-01-11'),
        estimatedArrival: new Date('2024-01-25')
      },
      totalCost: 2800,
      currency: 'SGD'
    });

    // Container 1: 40ft High Cube - In Use
    await Container.create({
      containerNumber: 'CCTU4012345',
      type: '40ft_high_cube',
      status: 'in_use',
      location: 'Pacific Ocean',
      currentShipment: shipment1._id,
      condition: 'excellent',
      lastInspectionDate: new Date('2024-01-03'),
      purchaseDate: new Date('2022-05-15'),
      purchasePrice: 4500
    });

    // Container 2: 40ft Standard - In Use
    await Container.create({
      containerNumber: 'CCTU4098765',
      type: '40ft_standard',
      status: 'in_use',
      location: 'Indian Ocean',
      currentShipment: shipment2._id,
      condition: 'excellent',
      lastInspectionDate: new Date('2024-01-05'),
      purchaseDate: new Date('2021-08-20'),
      purchasePrice: 4200
    });

    // Container 3: 40ft Standard - Available in Colombo Port
    await Container.create({
      containerNumber: 'CCTU4054321',
      type: '40ft_standard',
      status: 'available',
      location: 'Colombo Port',
      condition: 'good',
      lastInspectionDate: new Date('2023-12-15'),
      purchaseDate: new Date('2020-11-10'),
      purchasePrice: 3800
    });

    // Container 4: 20ft High Cube - In Use
    await Container.create({
      containerNumber: 'CCTU2011111',
      type: '20ft_refrigerated',
      status: 'in_use',
      location: 'South China Sea',
      currentShipment: shipment3._id,
      condition: 'good',
      lastInspectionDate: new Date('2024-01-02'),
      purchaseDate: new Date('2023-03-12'),
      purchasePrice: 7500
    });

    // Container 5: 40ft Refrigerated - Maintenance
    await Container.create({
      containerNumber: 'CCTU4067890',
      type: '40ft_refrigerated',
      status: 'maintenance',
      location: 'Dubai Port',
      condition: 'fair',
      lastInspectionDate: new Date('2023-12-28'),
      purchaseDate: new Date('2019-07-22'),
      purchasePrice: 8200
    });

    // Container 6: 20ft Standard - Available
    await Container.create({
      containerNumber: 'CCTU2033333',
      type: '20ft_standard',
      status: 'available',
      location: 'Hamburg Port',
      condition: 'excellent',
      lastInspectionDate: new Date('2024-01-01'),
      purchaseDate: new Date('2023-09-05'),
      purchasePrice: 2800
    });

    console.log('✅ Created 6 sample containers (2 available, 3 in use, 1 in maintenance)\n');

    // ==================== INITIALIZE FINANCIAL CATEGORIES & SOURCES ====================
    console.log('💰 Initializing financial categories and sources...');

    await ExpenseCategory.initializeDefaultCategories();
    await IncomeSource.initializeDefaultSources();

    console.log('✅ Initialized expense categories and income sources\n');

    // ==================== CREATE SAMPLE FINANCIAL DATA ====================
    console.log('💵 Creating sample financial data...');

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Helper to create dates within current month (ensures they stay in current month)
    const getDateThisMonth = (day) => {
      // Ensure day doesn't exceed current day for realistic data
      const safeDay = Math.min(day, currentDay);
      return new Date(currentYear, currentMonth, safeDay);
    };

    // ==================== TODAY'S TRANSACTIONS ====================
    await Expense.create({
      category: 'fuel',
      description: 'Vessel fuel - daily operations',
      amount: 2500,
      currency: 'USD',
      date: today,
      paymentMethod: 'Credit Card',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'Express freight delivery',
      amount: 8500,
      currency: 'USD',
      date: today,
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 8500,
      createdBy: superAdminUser._id
    });

    // ==================== THIS WEEK (within current month if possible) ====================
    // Only create if we're past day 2
    if (currentDay >= 2) {
      await Expense.create({
        category: 'port_fees',
        description: 'Port handling charges - Container CONT-045',
        amount: 1800,
        currency: 'USD',
        date: getDateThisMonth(currentDay - 1),
        paymentMethod: 'Bank Transfer',
        status: 'paid',
        createdBy: superAdminUser._id
      });
    }

    await Income.create({
      source: 'handling_fees',
      description: 'Container loading services',
      amount: 4200,
      currency: 'USD',
      date: getDateThisMonth(1),
      paymentMethod: 'Credit Card',
      status: 'received',
      amountReceived: 4200,
      createdBy: superAdminUser._id
    });

    // ==================== THIS MONTH (earlier days) ====================
    // Add more transactions spread across the month so far
    await Expense.create({
      category: 'staff_salaries',
      description: 'Monthly staff payment',
      amount: 3200,
      currency: 'USD',
      date: getDateThisMonth(1),
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'International shipment - Start of month',
      amount: 15000,
      currency: 'USD',
      date: getDateThisMonth(1),
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 15000,
      createdBy: superAdminUser._id
    });

    // ==================== LAST MONTH ====================
    const lastMonth = new Date(currentYear, currentMonth - 1, 15);

    await Expense.create({
      category: 'fuel',
      description: 'Vessel fuel - last month operations',
      amount: 18000,
      currency: 'USD',
      date: new Date(currentYear, currentMonth - 1, 10),
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Expense.create({
      category: 'port_fees',
      description: 'Port fees - Last month shipments',
      amount: 4200,
      currency: 'USD',
      date: new Date(currentYear, currentMonth - 1, 15),
      paymentMethod: 'Credit Card',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Expense.create({
      category: 'vehicle_maintenance',
      description: 'Truck maintenance and repairs',
      amount: 3800,
      currency: 'USD',
      date: new Date(currentYear, currentMonth - 1, 20),
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'Last month freight revenue',
      amount: 52000,
      currency: 'USD',
      date: new Date(currentYear, currentMonth - 1, 12),
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 52000,
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'handling_fees',
      description: 'Container handling - last month',
      amount: 6800,
      currency: 'USD',
      date: new Date(currentYear, currentMonth - 1, 18),
      paymentMethod: 'Credit Card',
      status: 'received',
      amountReceived: 6800,
      createdBy: superAdminUser._id
    });

    // ==================== PREVIOUS QUARTER (Q4 2025) ====================
    await Expense.create({
      category: 'fuel',
      description: 'Q4 Vessel fuel operations',
      amount: 22000,
      currency: 'USD',
      date: new Date(currentYear - 1, 10, 5), // November 2025
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Expense.create({
      category: 'staff_salaries',
      description: 'Monthly salaries - November',
      amount: 12000,
      currency: 'USD',
      date: new Date(currentYear - 1, 10, 1), // November 2025
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'Large shipment - Q4',
      amount: 68000,
      currency: 'USD',
      date: new Date(currentYear - 1, 10, 8), // November 2025
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 68000,
      createdBy: superAdminUser._id
    });

    // ==================== PREVIOUS YEAR (2025) ====================
    await Expense.create({
      category: 'technology',
      description: 'Annual software licenses - 2025',
      amount: 8500,
      currency: 'USD',
      date: new Date(currentYear - 1, 0, 15), // January 2025
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Expense.create({
      category: 'marketing',
      description: 'Q2 2025 Marketing campaign',
      amount: 5500,
      currency: 'USD',
      date: new Date(currentYear - 1, 4, 20), // May 2025
      paymentMethod: 'Credit Card',
      status: 'paid',
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'Q1 2025 Major contract shipment',
      amount: 95000,
      currency: 'USD',
      date: new Date(currentYear - 1, 1, 10), // February 2025
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 95000,
      createdBy: superAdminUser._id
    });

    await Income.create({
      source: 'freight_charges',
      description: 'Q2 2025 Export shipments',
      amount: 78000,
      currency: 'USD',
      date: new Date(currentYear - 1, 4, 15), // May 2025
      paymentMethod: 'Bank Transfer',
      status: 'received',
      amountReceived: 78000,
      createdBy: superAdminUser._id
    });

    console.log('✅ Created comprehensive financial data across multiple time periods\n');
    console.log('   📊 Expenses: 9 in 2026, 5 in 2025\n');
    console.log('   📊 Income: 6 in 2026, 4 in 2025\n');
    console.log('   📅 Coverage: Today, This Month, Last Month, This Quarter (Q1 2026), Last Quarter (Q4 2025), Previous Year (2025)\n');

    // ==================== SUMMARY ====================
    console.log('🎉 Seed completed successfully!\n');
    console.log('=' .repeat(60));
    console.log('📋 SEED SUMMARY');
    console.log('=' .repeat(60));
    console.log('\n✅ Created Roles:');
    console.log('   • Admin (full access)');
    console.log('   • Manager (operations)');
    console.log('   • Staff (limited access)');
    console.log('   • Client (portal access)');

    console.log('\n✅ Created Users:');
    console.log('\n   👑 SUPER ADMIN:');
    console.log('      Email: superadmin@ceylongrp.com');
    console.log('      Password: SuperAdmin@123');
    console.log('      Role: Super Administrator');

    console.log('\n   👑 ADMIN:');
    console.log('      Email: admin@ceylongrp.com');
    console.log('      Password: Admin@123');
    console.log('      Role: System Administrator');

    console.log('\n   👨‍💼 MANAGER:');
    console.log('      Email: manager@ceylongrp.com');
    console.log('      Password: Manager@123');
    console.log('      Role: Operations Manager');

    console.log('\n   👷 STAFF:');
    console.log('      Email: staff@ceylongrp.com');
    console.log('      Password: Staff@123');
    console.log('      Role: Staff Member');

    console.log('\n   🏢 CLIENT:');
    console.log('      Email: client@example.com');
    console.log('      Password: Client@123');
    console.log('      Company: Demo Trading Company');

    console.log('\n✅ Created Clients:');
    console.log('   • Acme Corporation (Manufacturing) - USA');
    console.log('   • Global Traders Ltd (Import/Export) - UK');
    console.log('   • Tech Import Solutions (Technology) - Singapore');
    console.log('   • Fashion Imports Inc (Fashion & Apparel) - Italy');
    console.log('   • Automotive Parts Global (Automotive) - Germany [Inactive]');
    console.log('   • Pacific Electronics Trading (Electronics) - Japan');
    console.log('   • Middle East Trading Hub (General Trading) - UAE');
    console.log('   • Pharma Logistics International (Pharmaceuticals) - Switzerland');
    console.log('   • Australian Imports Co (Retail) - Australia');
    console.log('   • Green Energy Solutions (Renewable Energy) - USA [Suspended]');

    console.log('\n✅ Created Suppliers:');
    console.log('   • Maritime Shipping Lines (Ocean Freight) - ⭐ 5.0');
    console.log('   • Global Container Services (Container/Warehouse) - ⭐ 4.9');
    console.log('   • Atlantic Port Solutions (Port Ops/Customs) - ⭐ 4.7');
    console.log('   • FastLog Trucking (Ground) - ⭐ 4.3 [Inactive]');
    console.log('   • SkyWings Cargo (Air/Express) - ⭐ 4.8');
    console.log('   • Pacific Customs Brokers (Customs) - ⭐ 4.6');
    console.log('   • EuroTransit Logistics (Ground/Warehouse) - ⭐ 4.5');
    console.log('   • QuickShip Express (Express/Air) - ⭐ N/A [Pending]');

    console.log('\n✅ Created Containers:');
    console.log('   • CCTU4012345 (40ft High Cube) - In Use [Excellent]');
    console.log('   • CCTU4098765 (40ft Standard) - In Use [Excellent]');
    console.log('   • CCTU4054321 (40ft Standard) - Available [Good]');
    console.log('   • CCTU2011111 (20ft Refrigerated) - In Use [Good]');
    console.log('   • CCTU4067890 (40ft Refrigerated) - Maintenance [Fair]');
    console.log('   • CCTU2033333 (20ft Standard) - Available [Excellent]');

    console.log('\n✅ Created Shipments:');
    console.log('   • SHP-001: Shanghai → Los Angeles (In Transit)');
    console.log('   • SHP-002: Colombo → London (In Transit)');
    console.log('   • SHP-003: Singapore → Tokyo (In Transit)');

    console.log('\n✅ Created Financial Records:');
    console.log('   • 3 Expense records (2 paid, 1 pending) - Total: $26,700');
    console.log('   • 3 Income records (2 received, 1 pending) - Total: $88,000');
    console.log('   • Initialized 12 expense categories');
    console.log('   • Initialized 8 income sources');

    console.log('\n' + '=' .repeat(60));
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('=' .repeat(60));
    console.log('1. These are DEFAULT passwords - CHANGE THEM IMMEDIATELY!');
    console.log('2. In production, use strong, unique passwords');
    console.log('3. Enable 2FA for admin accounts');
    console.log('4. Regularly rotate passwords');
    console.log('=' .repeat(60));

    console.log('\n✅ Database is ready for development!');
    console.log('🚀 You can now start the API server with: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    console.error('\nError details:', error.message);

    if (error.code === 11000) {
      console.error('\n⚠️  Duplicate key error - Data already exists.');
      console.error('   Run this script again to reset the database.');
    }

    process.exit(1);
  }
}

// Run the seed function
seed();
