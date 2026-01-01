const mongoose = require('mongoose');
const dns = require('dns');

// Configure DNS to use Google's public DNS servers for SRV record lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    // Ensure database name is included in connection string
    const mongoURI = process.env.MONGODB_URI.includes('/cct_cargo')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/cct_cargo?');

    const conn = await mongoose.connect(mongoURI, {
      // Use native DNS resolver to fix SRV lookup issues
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
