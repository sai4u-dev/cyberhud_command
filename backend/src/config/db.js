import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === "production") process.exit(1);
    else console.warn("Continuing without DB - API DB ops will fail until MONGO_URI is valid");
  }
};

export default connectDB;
