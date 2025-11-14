import type { Request, Response } from "express";
import type {
  GenerateContentRequest,
  GenerateContentResponse,
} from "../types/ai.js";
import { generateContent } from "../services/geminiApi.js";

export const generateBlogPost = async (
  req: Request<unknown, unknown, GenerateContentRequest>,
  res: Response
) => {
  try {
    const { prTitle, prBody, commits } = req.body;

    const prompt = createBlogPostPrompt(prTitle, prBody, commits);
    const responseText = await generateContent(prompt);
    const result = JSON.parse(responseText) as GenerateContentResponse;

    res.json(result);
  } catch (error) {
    console.error("Error generating blog post:", error);
    res.status(500).json({ error: "Failed to generate blog post" });
  }
};

const createBlogPostPrompt = (
  prTitle: string,
  prBody: string,
  commits: string[]
): string => {
  const commitsText = commits
    .map((commit, index) => `${index + 1}. ${commit}`)
    .join("\n");

  return `
    당신은 개발 기술 블로그를 작성하는 전문 작가입니다.
    다음 Pull Request 정보를 바탕으로 기술 블로그 포스트를 작성해주세요.

    ## PR 정보
    **제목**: ${prTitle}

    **설명**:
    ${prBody || "설명 없음"}

    **커밋 로그**:
    ${commitsText}

    ## 요구사항
    1. 블로그 포스트의 제목을 생성해주세요 (PR 제목과 다르게, 더 매력적으로)
    2. 마크다운 형식으로 본문을 작성해주세요
    3. 다음 섹션을 포함해주세요:
    - 개요 (이 작업이 왜 필요했는지)
    - 주요 변경사항 (커밋 로그 기반)
    - 기술적 설명 (어떻게 구현했는지)
    - 배운 점 또는 개선 사항
    4. 코드 블록은 적절한 언어 태그와 함께 사용해주세요
    5. 기술 블로그답게 전문적이지만 읽기 쉽게 작성해주세요

    ## 응답 형식
    반드시 다음 JSON 형식으로 응답해주세요:
    {
    "title": "블로그 포스트 제목",
    "content": "마크다운 형식의 본문 내용"
    }
    `;
};
