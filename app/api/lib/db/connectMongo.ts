import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    return mongoose.connect(process.env.MONGODB_URI || "");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectMongo;
