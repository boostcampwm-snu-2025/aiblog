import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function createBlogPost({ title, content }) {
  const prompt = `
    다음 GitHub 작업 내용을 기반으로 간단한 개발 블로그 글을 작성해 주세요.

    조건:
    - 한국어로 작성
    - 섹션을 나누고, 소제목(h2 수준) 포함
    - 커밋/PR에서 바뀐 것, 도입한 기술, 변경사항, 배운 점 등을 종합적으로 정리
    - 너무 장황한 서술 금지

    제목: ${title}

    원본 내용:
    ${content}
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("=== Gemini response ===", response);
    const text = response.text;
    return text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Failed to generate summary");
  }
}