import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateContent = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini API returned empty response");
  }

  return text;
};
