import UsageOverview from "@/app/api/lib/models/UsageOverview";
import Subscription from "@/app/api/lib/models/Subscription";
import connectMongoWithRetry from "@/app/api/lib/db/connectMongo";

export const getUsageOverview = async (userId: string) => {
    try {
        await connectMongoWithRetry();
        const usageOverview = await UsageOverview.findOne({ userId: userId }, { _id: 0, userId: 0, createdAt: 0, updatedAt: 0 });
        return usageOverview;
    } catch (error) {
        console.error("Error getting usage overview:", error);
        throw error;
    }
};

export const updateUsageOverview = async (userId: string, tokensUsed: number) => {
    try {
        await connectMongoWithRetry();
        const usageOverview = await UsageOverview.findOne({ userId: userId }, { _id: 0, userId: 0, createdAt: 0, updatedAt: 0 });
        usageOverview.tokensUsed += tokensUsed;
        await usageOverview.save();
    } catch (error) {
        console.error("Error updating usage overview:", error);
        throw error;
    }
};

export const getBillingData = async (userId: string) => {
    try {
        await connectMongoWithRetry();
        const billingData = await Subscription.findOne({ userId: userId }, { billingAddress: 1, billingHistory: 1 });
        return billingData;
    } catch (error) {
        console.error("Error getting billing data:", error);
        throw error;
    }
}

export const getBillingAddress = async (userId: string) => {
    try {
        await connectMongoWithRetry();
        const billingAddress = await Subscription.findOne({ userId: userId }, { billingAddress: 1 });
        return billingAddress;
    } catch (error) {
        console.error("Error getting billing address:", error);
        throw error;
    }
}

export const updateBillingAddress = async (userId: string, newBillingAddress: any) => {
    try {
        await connectMongoWithRetry();
        const subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        subscription.billingAddress = newBillingAddress; // Update the address
        await subscription.save(); // Save changes to the database
        return subscription;
    } catch (error) {
        console.error("Error updating billing address:", error);
        throw error;
    }
};

export const addBillingAddress = async (userId: string, newBillingAddress: any) => {
    try {
        await connectMongoWithRetry();
        const subscription = await Subscription.findOne({ userId: userId });    

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        subscription.billingAddress.push(newBillingAddress);
        await subscription.save();
        return subscription;
    } catch (error) {
        console.error("Error adding billing address:", error);
        throw error;
    }
}
