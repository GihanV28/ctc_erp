require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role'); // Need to load Role model first
const User = require('../src/models/User');
const Client = require('../src/models/Client');

async function checkUserClientId() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all client users
    const clientUsers = await User.find({ userType: 'client' })
      .populate('role')
      .select('email firstName lastName userType clientId');

    console.log(`\nFound ${clientUsers.length} client user(s):\n`);

    for (const user of clientUsers) {
      console.log('Email:', user.email);
      console.log('Name:', user.firstName, user.lastName);
      console.log('User Type:', user.userType);
      console.log('ClientId:', user.clientId ? user.clientId.toString() : 'NOT SET');

      if (user.clientId) {
        const client = await Client.findById(user.clientId);
        if (client) {
          console.log('Client Company:', client.companyName);
          console.log('Client ID:', client.clientId);
        } else {
          console.log('⚠️ ClientId exists but Client document not found!');
        }
      } else {
        console.log('⚠️ WARNING: ClientId is NOT set for this user!');
      }
      console.log('---');
    }

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkUserClientId();
