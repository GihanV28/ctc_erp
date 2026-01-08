require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

async function fixUserRole() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Get the current client role
    const clientRole = await Role.findOne({ name: 'client' });
    if (!clientRole) {
      console.error('❌ Client role not found!');
      process.exit(1);
    }

    console.log('Found client role:');
    console.log('  ID:', clientRole._id);
    console.log('  Name:', clientRole.name);
    console.log('  Display Name:', clientRole.displayName);

    // Find all client users
    const clientUsers = await User.find({ userType: 'client' });
    console.log(`\nFound ${clientUsers.length} client user(s)\n`);

    for (const user of clientUsers) {
      console.log(`User: ${user.email}`);
      console.log(`  Current role ID: ${user.role}`);
      console.log(`  Expected role ID: ${clientRole._id}`);

      if (user.role.toString() !== clientRole._id.toString()) {
        console.log('  ⚠️ Role ID mismatch - updating...');
        user.role = clientRole._id;
        await user.save();
        console.log('  ✅ Updated successfully!');
      } else {
        console.log('  ✅ Role ID is correct');
      }
      console.log();
    }

    console.log('All users have been checked and updated if necessary.');

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixUserRole();
