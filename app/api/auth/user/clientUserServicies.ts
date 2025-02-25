import connectMongo from "@/app/api/lib/db/connectMongo";
import User from "@/app/api/lib/models/User";

export const getUser = async (userId: string) => {
    await connectMongo();
    const user = await User.findOne({ clerkUid: userId });
    
    const userData = {
        subscriptionType: user?.subscriptionType,
        stepsCompleted: user?.stepsCompleted,
    };
    return userData;
};

export const updateUser = async (userId: string, data: any) => {
    await connectMongo();
    const user = await User.findOneAndUpdate({ clerkUid: userId }, data, { new: true });
    return user;
};


