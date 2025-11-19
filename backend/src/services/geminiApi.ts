import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (!genAI) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  return genAI;
};

export const generateContent = async (prompt: string): Promise<string> => {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Gemini API returned empty response");
  }

  return text;
};
