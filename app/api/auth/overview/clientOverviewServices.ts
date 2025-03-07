import UsageOverview from "@/app/api/lib/models/UsageOverview";

export const getUsageOverview = async (userId: string) => {
    const usageOverview = await UsageOverview.findOne({ userId });
    return usageOverview;
};

export const updateUsageOverview = async (userId: string, data: any) => {

    const allowedUpdates = ["totalTokens", "maxRepositories"];

    const filteredData = Object.keys(data).reduce<Record<string, any>>((result, key) => {
        if (allowedUpdates.includes(key)) {
            result[key] = data[key];
        }
        return result;
    }, {});

    const usageOverview = await UsageOverview.findOneAndUpdate({ userId }, filteredData, { new: true });
    return usageOverview;
};



