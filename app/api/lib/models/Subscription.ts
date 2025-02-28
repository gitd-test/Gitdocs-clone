import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    subscriptionType: { type: String, enum: ["Free", "Pro", "Enterprise"], required: true },
    subscriptionStatus: { type: String, enum: ["Active", "Inactive", "Expired"], required: true },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
    subscriptionPrice: { type: Number, required: true },
    leftOverTokens: { type: Number, required: true },
    bonusTokens: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

