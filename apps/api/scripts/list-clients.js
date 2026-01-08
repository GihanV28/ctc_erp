const mongoose = require('mongoose');
require('dotenv').config();

async function getClientLogins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('../src/models/User');

    const clients = await User.find({ role: 'client' })
      .select('email username firstName lastName isActive createdAt')
      .sort({ createdAt: -1 });

    console.log('\n=== Client Portal Logins ===\n');

    if (clients.length === 0) {
      console.log('No client users found in the database.');
    } else {
      clients.forEach((client, index) => {
        console.log(`${index + 1}. Email: ${client.email}`);
        console.log(`   Username: ${client.username || 'N/A'}`);
        console.log(`   Name: ${client.firstName} ${client.lastName}`);
        console.log(`   Status: ${client.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Created: ${client.createdAt.toISOString()}`);
        console.log('');
      });
      console.log(`Total client accounts: ${clients.length}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getClientLogins();
