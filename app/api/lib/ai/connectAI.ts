import OpenAI from "openai";

export async function connectAI(prompt: string, model: string) {

    const parsedPrompt = JSON.parse(prompt);

    const systemPrompt = parsedPrompt.systemPrompt;

    const userPrompt = parsedPrompt.userPrompt;

    const previousReadme = parsedPrompt.previousReadme || "";

    const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    
    const response = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: `You are a helpful assistant. ${systemPrompt}` },
            {
                role: "user",
                content: userPrompt + (previousReadme ? `\n\nPrevious README: ${previousReadme}` : ""),
            },
        ],
        stream: true,
    });
    
    return response;
}
