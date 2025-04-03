const mongoose = require('mongoose');
const logger = require('./logger'); // Import the logger

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ MongoDB connected!');
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err);
    process.exit(1); // Exit the process to prevent running a broken app
  }
};

module.exports = connectDB;
