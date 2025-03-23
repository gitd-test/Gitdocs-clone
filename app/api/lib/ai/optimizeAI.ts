import OpenAI from "openai";

export async function optimizeAI(userId: string, prompt: string) {
    if (!userId) {
        throw new Error("User not found");
    }   

    const parsedPrompt = JSON.parse(prompt);

    const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    
    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: parsedPrompt,
            },
        ],
    });
    
    console.log(response.choices[0].message);
    
}
