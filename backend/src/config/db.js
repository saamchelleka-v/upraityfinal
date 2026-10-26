import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/upraity_and_son');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn('⚠️  Database connection could not be established. Ensure MongoDB service is running or check your MONGODB_URI in backend/.env');
    return false;
  }
};

export default connectDB;
