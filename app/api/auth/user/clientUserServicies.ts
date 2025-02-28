import User from "@/app/api/lib/models/User";

export const getUser = async (userId: string) => {
    const user = await User.findOne({ clerkUid: userId });
    
    const userData = {
        subscriptionType: user?.subscriptionType,
        stepsCompleted: user?.stepsCompleted,
    };
    return userData;
};

export const updateUser = async (userId: string, data: any) => {
    const user = await User.findOneAndUpdate({ clerkUid: userId }, data, { new: true });
    return user;
};


