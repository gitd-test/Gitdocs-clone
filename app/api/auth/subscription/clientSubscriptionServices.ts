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
};

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

        // Check if the billingAddress array exists
        if (!Array.isArray(subscription.billingAddress)) {
            subscription.billingAddress = [];
        }

        // Find the index of the existing address (if any)
        const existingIndex = subscription.billingAddress.findIndex(
            (addr: any) =>
                addr.name === newBillingAddress.name && addr.contact === newBillingAddress.contact
        );

        if (existingIndex !== -1) {
            // Update the existing address
            subscription.billingAddress[existingIndex] = {
                ...subscription.billingAddress[existingIndex],
                ...newBillingAddress,
            };
        } else {
            // Add the new address if no match is found
            subscription.billingAddress.push(newBillingAddress);
        }

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

export const deleteBillingAddress = async (userId: string, addressData: any) => {
    try {
        await connectMongoWithRetry();
        const subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        // Check if the address to be deleted has `isPrimary: true`
        const isPrimaryToDelete = subscription.billingAddress.some(
            (addr: any) =>
                addr.name === addressData.name &&
                addr.contact === addressData.contact &&
                addr.isPrimary === true
        );

        // Filter the address to exclude the one being deleted
        subscription.billingAddress = subscription.billingAddress.filter(
            (addr: any) => !(addr.name === addressData.name && addr.contact === addressData.contact)
        );

        // If the deleted address was primary, set the first remaining address as primary
        if (isPrimaryToDelete && subscription.billingAddress.length > 0) {
            subscription.billingAddress[0].isPrimary = true;
        }

        await subscription.save(); // Save changes to the database
        return subscription;
    } catch (error) {
        console.error("Error deleting billing address:", error);
        throw error;
    }
};

export const createSubscription = async (userId: string, razorpayOrderId: string, subscriptionType: string, price: number) => {
    try {
        await connectMongoWithRetry();
        const subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            throw new Error("User not found");
        }

        const updatedSubscription = await Subscription.findOneAndUpdate(    
            { userId: userId },
            { $set: {
                        billingHistory: [...subscription.billingHistory, {
                            razorpayOrderId: razorpayOrderId,
                            subscriptionType: subscriptionType,
                            subscriptionPrice: price,
                            status: "pending",
                            subscriptionStartDate: new Date(),
                            subscriptionEndDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                        }]
                     } },
            { new: true }
        );

        if (!updatedSubscription) {
            throw new Error("Failed to update subscription");
        }

        return updatedSubscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
    }
};

export const updateSubscriptionStatus = async (
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    subscriptionStatus: string,
    subscriptionType: string,
    price: number
) => {
    try {
        await connectMongoWithRetry();

        // Find the subscription
        const subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        // Validate billingHistory
        const billingIndex = subscription.billingHistory.findIndex(
            (entry: any) => entry.razorpayOrderId === razorpayOrderId
        );

        if (billingIndex === -1) {
            throw new Error("Billing history entry not found for the provided Razorpay order ID");
        }

        // Calculate updated tokens
        const leftOverTokens =
            (subscription.leftOverTokens || 0) + (price === 9 ? 5000000 : 10000000);
        const bonusTokens =
            (subscription.bonusTokens || 0) + (price === 9 ? 10000 : 20000);

        // Perform the update
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { userId: userId, [`billingHistory.${billingIndex}.razorpayId`]: razorpayOrderId },
            {
                $set: {
                    subscriptionType: subscriptionType,
                    subscriptionPrice: price,
                    subscriptionStatus: subscriptionStatus,
                    subscriptionStartDate: new Date(),
                    subscriptionEndDate: new Date(
                        new Date().getTime() + 30 * 24 * 60 * 60 * 1000
                    ),
                    leftOverTokens: leftOverTokens,
                    bonusTokens: bonusTokens,
                    [`billingHistory.${billingIndex}.paymentId`]: razorpayPaymentId,
                    [`billingHistory.${billingIndex}.status`]: "completed",
                },
            },
            { new: true }
        );

        if (!updatedSubscription) {
            throw new Error("Failed to update subscription");
        }

        return updatedSubscription;
    } catch (error) {
        console.error("Error updating subscription status:", error);
        throw error;
    }
};


