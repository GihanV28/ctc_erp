const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function checkUsers() {
  try {
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');

    await mongoose.connect(mongoURI, { family: 4 });
    console.log('✅ Connected to MongoDB\n');

    const Role = require('../src/models/Role');
    const User = require('../src/models/User');
    const users = await User.find({}).populate('role', 'name displayName').select('firstName lastName email userType status emailVerified');

    console.log('='.repeat(70));
    console.log('USER ACCOUNTS IN DATABASE');
    console.log('='.repeat(70));

    users.forEach(user => {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.firstName} ${user.lastName}`);
      console.log(`🔐 Role: ${user.role?.displayName || 'N/A'} (${user.role?.name || 'N/A'})`);
      console.log(`📋 User Type: ${user.userType}`);
      console.log(`✅ Status: ${user.status}`);
      console.log(`📨 Email Verified: ${user.emailVerified}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('CORRECT LOGIN CREDENTIALS (from seed script):');
    console.log('='.repeat(70));
    console.log('\n🔑 Super Admin:');
    console.log('   Email: superadmin@ceylongrp.com');
    console.log('   Password: SuperAdmin@123');
    console.log('\n🔑 Admin:');
    console.log('   Email: admin@ceylongrp.com');
    console.log('   Password: Admin@123');
    console.log('\n🔑 Manager:');
    console.log('   Email: manager@ceylongrp.com');
    console.log('   Password: Manager@123');
    console.log('\n🔑 Staff:');
    console.log('   Email: staff@ceylongrp.com');
    console.log('   Password: Staff@123');
    console.log('\n🔑 Client:');
    console.log('   Email: client@example.com');
    console.log('   Password: Client@123');
    console.log('\n' + '='.repeat(70));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
