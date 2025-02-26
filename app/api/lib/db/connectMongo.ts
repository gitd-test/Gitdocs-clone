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

const connectMongoWithRetry = async () => {
  let tries = 0;
  while (tries < 3) {
    try {
      await connectMongo();
      break;
    } catch (error) {
      tries++;
    }
  }
  throw new Error("Failed to connect to MongoDB");
};
export default connectMongoWithRetry;
