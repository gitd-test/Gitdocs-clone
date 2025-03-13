import { GoogleGenerativeAI } from "@google/generative-ai";

export const tokenize = async (prompt: string, modelValue: string) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: modelValue,
  });

  // Count tokens in a prompt without calling text generation.
  const countResult = await model.countTokens(
    prompt,
  );

  return countResult.totalTokens;
};

