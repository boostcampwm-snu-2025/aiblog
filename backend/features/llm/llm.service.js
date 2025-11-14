import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createBlogPost(title, content) {
  const prompt = `
    다음은 GitHub에서 작성한 작업 내용입니다.

    [제목] ${title || "제목 없음"}
    [내용]
    ${content}

    이 내용을 기반으로 개발자 블로그용 글을 작성해주세요.
    요구사항:
    - 자연스럽고 논리적인 한국어 문장
    - 핵심 기술 요약, 문제 해결 과정, 배운 점, 느낀 점 포함
    - 마크다운 형식으로 작성 (제목, 코드블럭, 리스트 등 사용)
    - 너무 길지 않게 800~1200자 내외
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", 
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}