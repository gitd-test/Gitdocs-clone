import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        clerkUid: {
            type: String,
            required: true,
            unique: true,
            index: true, // Indexed for faster lookups
        },
        githubUid: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values
            required: false,
            index: true, // Indexed for queries involving GitHub UID
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
            index: true, // Indexed for faster lookups by email
        },
        subscriptionType: {
            type: String,
            enum: ["Free", "Pro", "Enterprise"], // Define possible subscription types
            default: "Free",
        },
        signupDate: {
            type: Date,
            default: Date.now,
            index: true, // Indexed to allow filtering users by signup date
        },
        lastLogin: {
            type: Date,
            default: null, // To track when the user last logged in
            index: true, // Indexed for filtering or sorting by last login
        },
        repositories: {
            type: [String],
            default: [],
            ref: "Repository",
        },
        stepsCompleted: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Explicitly define indexes with additional options
UserSchema.index({ githubUid: 1 }, { sparse: true }); // Sparse index for GitHub UID
UserSchema.index({ clerkUid: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ signupDate: 1 });
UserSchema.index({ lastLogin: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
