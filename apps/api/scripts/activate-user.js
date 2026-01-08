require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Client = require('../src/models/Client');

const activateUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'gihanw56@gmail.com';

    // Update User status
    const user = await User.findOneAndUpdate(
      { email },
      { status: 'active' },
      { new: true }
    );

    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    console.log(`✅ User ${email} status updated to 'active'`);

    // Update Client status if linked
    if (user.clientId) {
      const client = await Client.findByIdAndUpdate(
        user.clientId,
        { status: 'active' },
        { new: true }
      );

      if (client) {
        console.log(`✅ Client ${client.companyName} status updated to 'active'`);
      }
    }

    console.log('\n✅ User activation completed successfully!');
  } catch (error) {
    console.error('❌ Error activating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

activateUser();
