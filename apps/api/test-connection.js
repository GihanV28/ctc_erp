require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    // Ensure database name is included
    const mongoURI = process.env.MONGODB_URI.includes('/ceylon-cargo-transport')
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI.replace('/?', '/ceylon-cargo-transport?');
    
    await mongoose.connect(mongoURI, {
      family: 4, // Use IPv4
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📁 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('📊 Ready State:', mongoose.connection.readyState);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📦 Existing Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (fresh database)');
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    process.exit(1);
  }
}

testConnection();
