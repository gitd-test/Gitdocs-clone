import { GoogleGenerativeAI } from "@google/generative-ai";

export async function connectGemini(userId: string, prompt: string, model: string) {


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const genModel = genAI.getGenerativeModel({ model: model });

    const result = await genModel.generateContentStream(prompt);

    console.log(model);

    return result;
}
