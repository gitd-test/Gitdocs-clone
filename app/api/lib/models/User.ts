import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkUid: {
      type: String,
      required: true,
      unique: true, 
    },
    githubUid: {
      type: String,
      unique: true,
      required: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    subscriptionType: {
      type: String,
      enum: ["free", "basic", "pro"], // Define possible subscription types
      default: "free",
    },
    signupDate: {
      type: Date,
      default: Date.now, 
    },
    lastLogin: {
      type: Date,
      default: null, // To track when the user last logged in
    },
    repositories: {
      type: [String],
      default: [],
      ref: "Repository",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }

);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
