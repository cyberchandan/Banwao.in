const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/banwao_db');
    console.log(`[Banwao DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Banwao DB Error] ${error.message}`);
    console.error('Please ensure MongoDB is running locally or specify a valid MONGODB_URI in server/.env');
    // We do not crash the process immediately in dev so health checks can report status
    return null;
  }
};

module.exports = connectDB;
