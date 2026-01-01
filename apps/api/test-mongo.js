require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    process.exit(1);
  });
