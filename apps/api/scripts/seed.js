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

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB with explicit database name
    const mongoURI = process.env.MONGODB_URI.replace('/?', '/cct_cargo?');
    await mongoose.connect(mongoURI, {
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - comment out in production)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Client.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // ==================== CREATE ROLES ====================
    console.log('📝 Creating roles...');

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

    console.log('✅ Created 4 roles (admin, manager, staff, client)\n');

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

    // Create client profile
    const demoClient = new Client({
      companyName: 'Demo Trading Company',
      tradingName: 'Demo Trading',
      industry: 'Import/Export',
      registrationNumber: 'REG-2024-001',
      taxId: 'TAX-123456',
      address: {
        street: '123 Business Street',
        city: 'Colombo',
        state: 'Western Province',
        postalCode: '00100',
        country: 'Sri Lanka'
      },
      contactPerson: {
        firstName: 'Demo',
        lastName: 'Client',
        position: 'CEO',
        email: 'client@example.com',
        phone: '+94771234567'
      },
      billingAddress: {
        street: '123 Business Street',
        city: 'Colombo',
        state: 'Western Province',
        postalCode: '00100',
        country: 'Sri Lanka',
        sameAsAddress: true
      },
      paymentTerms: 30,
      creditLimit: 50000,
      status: 'active',
      notes: 'Demo client for testing purposes'
    });
    await demoClient.save();

    console.log('✅ Created sample client\n');

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
