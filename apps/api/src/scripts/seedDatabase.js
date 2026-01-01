require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing roles and users...');
    await Role.deleteMany({});
    await User.deleteMany({});

    // ===== CREATE ROLES =====
    console.log('📝 Creating roles...');

    const superAdminRole = await Role.create({
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      userType: 'admin',
      isSystem: true,
      permissions: ['*'], // Wildcard - all permissions
    });

    const adminRole = await Role.create({
      name: 'admin',
      displayName: 'Administrator',
      description: 'Administrative access with most permissions',
      userType: 'admin',
      isSystem: true,
      permissions: [
        'users:read',
        'users:write',
        'roles:read',
        'shipments:read',
        'shipments:write',
        'containers:read',
        'containers:write',
        'clients:read',
        'clients:write',
        'suppliers:read',
        'suppliers:write',
        'tracking:read',
        'tracking:write',
        'reports:read',
        'reports:write',
        'invoices:read',
        'invoices:write',
        'support:read',
        'support:write',
        'settings:read',
        'settings:write',
      ],
    });

    const operationsManagerRole = await Role.create({
      name: 'operations_manager',
      displayName: 'Operations Manager',
      description: 'Manage shipments, containers, and tracking',
      userType: 'admin',
      isSystem: true,
      permissions: [
        'shipments:read',
        'shipments:write',
        'containers:read',
        'containers:write',
        'suppliers:read',
        'tracking:read',
        'tracking:write',
        'clients:read',
        'support:read',
        'support:write',
      ],
    });

    const clientUserRole = await Role.create({
      name: 'client_user',
      displayName: 'Client User',
      description: 'Client portal access with limited permissions',
      userType: 'client',
      isSystem: true,
      permissions: [
        'shipments:read:own',
        'tracking:read:own',
        'invoices:read:own',
        'support:read:own',
        'support:write',
        'profile:read',
        'profile:write',
      ],
    });

    console.log('✅ Roles created successfully');

    // ===== CREATE SUPER ADMIN USER =====
    console.log('👤 Creating super admin user...');

    const superAdminUser = await User.create({
      email: 'admin@cct.ceylongrp.com',
      password: 'Admin@123456', // Will be hashed by pre-save hook
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+94771234567',
      role: superAdminRole._id,
      userType: 'admin',
      status: 'active',
      emailVerified: true,
    });

    console.log('✅ Super admin user created successfully');
    console.log('\n========================================');
    console.log('🎉 Database seed completed!');
    console.log('========================================');
    console.log('\n📋 Created Roles:');
    console.log(`  - ${superAdminRole.displayName} (${superAdminRole.name})`);
    console.log(`  - ${adminRole.displayName} (${adminRole.name})`);
    console.log(
      `  - ${operationsManagerRole.displayName} (${operationsManagerRole.name})`
    );
    console.log(`  - ${clientUserRole.displayName} (${clientUserRole.name})`);
    console.log('\n👤 Super Admin Credentials:');
    console.log('   Email: admin@cct.ceylongrp.com');
    console.log('   Password: Admin@123456');
    console.log('\n⚠️  Please change the password after first login!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();