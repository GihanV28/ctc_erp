require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

async function checkClientPermissions() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const clientRole = await Role.findOne({ name: 'client' });

    if (!clientRole) {
      console.log('Client role not found');
    } else {
      console.log('\nClient Role Details:');
      console.log('Name:', clientRole.name);
      console.log('Display Name:', clientRole.displayName);
      console.log('User Type:', clientRole.userType);
      console.log('Permissions:', JSON.stringify(clientRole.permissions, null, 2));
    }

    // Check a sample client user
    const clientUser = await User.findOne({ userType: 'client' }).populate('role');

    if (clientUser) {
      console.log('\n\nSample Client User:');
      console.log('Email:', clientUser.email);
      console.log('User Type:', clientUser.userType);
      console.log('ClientId:', clientUser.clientId);
      console.log('Role:', clientUser.role.name);
      console.log('Role Permissions:', JSON.stringify(clientUser.role.permissions, null, 2));

      // Test hasPermission method
      const hasShipmentsRead = await clientUser.hasPermission('shipments:read');
      const hasShipmentsReadOwn = await clientUser.hasPermission('shipments:read:own');

      console.log('\nPermission Checks:');
      console.log('Has shipments:read:', hasShipmentsRead);
      console.log('Has shipments:read:own:', hasShipmentsReadOwn);
    }

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkClientPermissions();
