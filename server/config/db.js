import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb+srv://contact_db_user:VM7vPjtxhkZvOlnU@clusteradhiuman.znzeltu.mongodb.net/pet-hostel?appName=ClusterAdhiuman';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`🍃 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
