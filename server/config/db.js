const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';
  
  try {
    // Attempt connecting to the configured URI with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`✅ MongoDB Connected to Primary Database: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`⚠️  Could not connect to external/local MongoDB at ${uri}: ${error.message}`);
    console.log('🔄  Starting embedded in-memory MongoDB server for seamless zero-setup testing...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded In-Memory MongoDB Connected at: ${memoryUri}`);
      console.log('💡 Note: Data is kept in-memory for testing/viva demonstration without external database setup.');
      return conn;
    } catch (memErr) {
      console.error('❌ Failed to launch embedded MongoDB server:', memErr.message);
    }
  }
};

module.exports = connectDB;
