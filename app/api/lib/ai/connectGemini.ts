import { GoogleGenerativeAI } from "@google/generative-ai";
import connectMongo from "../db/connectMongo";
import User from "../models/User";

export async function connectGemini(userId: string, prompt: string) {

    await connectMongo();
    const user = await User.find({clerkUid: userId});

    if (!user) {
        return { error: "Unauthorized" };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContentStream(prompt);

    return result;
}
