require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

async function testShipmentAPI() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Get the client user
    const clientUser = await User.findOne({ email: 'gihanw56@gmail.com' })
      .populate('role')
      .select('+password');

    if (!clientUser) {
      console.error('Client user not found!');
      return;
    }

    console.log('User Details:');
    console.log('Email:', clientUser.email);
    console.log('User Type:', clientUser.userType);
    console.log('ClientId:', clientUser.clientId);
    console.log('Role:', clientUser.role.name);
    console.log('Role Permissions:', clientUser.role.permissions);
    console.log();

    // Simulate the RBAC middleware check
    console.log('=== Simulating RBAC Middleware ===');

    // Check if user role is populated
    if (!clientUser.role || !clientUser.role.permissions) {
      console.error('❌ Role not populated!');
      return;
    }
    console.log('✅ Role is populated');

    // Check for any of the required permissions
    const requiredPermissions = ['shipments:read', 'shipments:read:own'];
    console.log('Required permissions (any of):', requiredPermissions);

    let hasAnyPermission = false;
    for (const permission of requiredPermissions) {
      const hasPermission = await clientUser.hasPermission(permission);
      console.log(`  - ${permission}: ${hasPermission ? '✅' : '❌'}`);
      if (hasPermission) {
        hasAnyPermission = true;
      }
    }

    if (!hasAnyPermission) {
      console.error('\n❌ MIDDLEWARE WOULD BLOCK: User does not have any of the required permissions');
      console.error('This is the source of the 403 error!');
    } else {
      console.log('\n✅ MIDDLEWARE WOULD PASS: User has at least one required permission');

      // Check controller logic
      console.log('\n=== Simulating Controller Logic ===');

      if (clientUser.userType === 'client' && !(await clientUser.hasPermission('shipments:read'))) {
        console.log('✅ User type is client and does not have shipments:read');
        console.log('✅ Controller will filter by clientId:', clientUser.clientId);

        if (!clientUser.clientId) {
          console.error('❌ ERROR: Client ID not found for user');
        } else {
          console.log('✅ ClientId is set, filtering will work correctly');
        }
      } else if (clientUser.userType === 'client') {
        console.log('⚠️ User type is client but HAS shipments:read permission');
        console.log('Controller will NOT filter by client - user will see all shipments');
      } else {
        console.log('User is admin type - will see all shipments');
      }
    }

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testShipmentAPI();
