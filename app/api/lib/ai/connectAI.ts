import OpenAI from "openai";
import { tokenize } from "../geminiTokenizer";
import { updateTokensUsedOverview } from "../../auth/overview/clientOverviewServices";

export async function connectAI(userId: string, prompt: string, model: string) {
    if (!userId) {
        throw new Error("User not found");
    }

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

    // Create two identical streams using tee()
    const [responseForCounting, responseForReturn] = response.tee();

    // Handle token counting in the background
    updateTokensUsed(userId, prompt, responseForCounting, model).catch(error => {
        console.error("Error updating tokens:", error);
    });

    // Return the other stream for the client
    return responseForReturn;
}

async function updateTokensUsed(userId: string, prompt: string, response: any, model: string) {
    try {
        const promptTokens = await tokenize(prompt, model);
        let responseAccumulator = "";
        
        // Process the stream to accumulate the full response text
        for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            responseAccumulator += content;
        }
        
        const responseTokens = await tokenize(responseAccumulator, model);
        
        if (responseTokens > 20000) {
            console.warn("Response exceeds token limit");
            // Consider not throwing here to prevent disruption, just log
        }
        
        const totalTokens = promptTokens + responseTokens;
        await updateTokensUsedOverview(userId, totalTokens);
    } catch (error) {
        console.error("Error in token counting:", error);
        // Log but don't throw to prevent disrupting the main response
    }
}