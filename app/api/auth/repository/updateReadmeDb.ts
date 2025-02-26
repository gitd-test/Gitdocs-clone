import connectMongoWithRetry from "@/app/api/lib/db/connectMongo";
import Readme from "@/app/api/lib/models/Readme";

export const updateReadmeDb = async (repositoryId: string, readmeData: any) => {
    await connectMongo();
    try {
        const readme = await Readme.findOne({ repositoryId });

    if (readme) {
        readme.content = readmeData.decodedContent; 
        await readme.save();
        } else {
            await Readme.create({ repositoryId, content: readmeData.decodedContent });
        }
    } catch (error) {
        console.error("Error updating readme in db:", error);
    }
};

export const fetchReadmeDb = async (repositoryId: string) => {
    await connectMongo();
    const readme = await Readme.findOne({ repositoryId });
    return readme?.content;
};
