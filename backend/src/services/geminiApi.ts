import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateAiPostResponse } from "../types/post.js";

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

export const generateGeminiContent = async (
  prompt: string
): Promise<GenerateAiPostResponse> => {
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

  const parseAiResponse = (responseText: string): GenerateAiPostResponse => {
    try {
      let cleanedText = responseText.trim();

      // 1. 코드 블록 제거
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      // 2. 특수 공백 문자를 일반 공백으로 치환
      // \u00A0: Non-breaking space
      // \u2000-\u200B: 다양한 유니코드 공백
      cleanedText = cleanedText
        .replace(/\u00A0/g, " ")
        .replace(/[\u2000-\u200B]/g, " ")
        .replace(/\u3000/g, " "); // 전각 공백

      // 3. JSON 파싱
      const result = JSON.parse(cleanedText) as GenerateAiPostResponse;

      return result;
    } catch (error) {
      console.error("❌ JSON 파싱 실패");
      console.error("에러:", error);
      console.error("응답 길이:", responseText.length);

      // 디버깅: 제어 문자 찾기
      const controlChars = responseText.match(/[\x00-\x1F\x7F-\x9F]/g);
      if (controlChars) {
        console.error("발견된 제어 문자:", controlChars);
      }

      throw new Error("AI 응답을 JSON으로 파싱할 수 없습니다");
    }
  };

  const parsedResult = parseAiResponse(text);

  return parsedResult;
};
