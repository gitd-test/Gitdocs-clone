import { GoogleGenerativeAI } from "@google/generative-ai";
import connectMongoWithRetry from "../db/connectMongo";
import User from "../models/User";

export async function connectGemini(userId: string, prompt: string, model: string) {

    await connectMongoWithRetry();
    const user = await User.find({clerkUid: userId});

    if (!user) {
        return { error: "Unauthorized" };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const genModel = genAI.getGenerativeModel({ model: model });

    const result = await genModel.generateContentStream(prompt);

    console.log(model);

    return result;
}
