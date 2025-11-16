import type { Request, Response } from "express";
import { generateContent } from "../services/geminiApi.js";
import { fetchGithubData } from "../services/githubApi.js";
import { GitHubCommit, GitHubPullRequest } from "../types/github.js";
import { GenerateAiPostResponse } from "../types/post.js";

type GenerateContentQuery = {
  owner: string;
  repository: string;
  prNumber: string;
};

export const generateAiPost = async (
  req: Request<unknown, unknown, unknown, GenerateContentQuery>,
  res: Response<GenerateAiPostResponse | { error: string }>
) => {
  try {
    const { owner, repository, prNumber } = req.query;
    const prNum = Number(prNumber);

    // 1. PR detail 가져오기
    const prDetail = await fetchGithubData<GitHubPullRequest>(
      `/repos/${owner}/${repository}/pulls/${prNum}`
    );

    // 2. Commits 가져오기
    const commits = await fetchGithubData<GitHubCommit[]>(
      `/repos/${owner}/${repository}/pulls/${prNum}/commits`
    );

    // 3. 데이터 추출
    const prTitle = prDetail.title;
    const prBody = prDetail.body || "";
    const commitMessages = commits.map((c) => c.commit.message);

    // 4. AI 콘텐츠 생성 요청
    const prompt = createBlogPostPrompt(prTitle, prBody, commitMessages);
    const responseText = await generateContent(prompt);
    const result = parseAiResponse(responseText);
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
당신은 기술 블로그를 작성하는 시니어 웹 프론트엔드 개발자입니다. 
이 블로그는 개발자가 수행한 작업을 회고하고, 배운 점을 정리하며, 나중에 다시 참고하기 위한 기록 목적으로 작성됩니다.
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
4. 본문에 코드 예시를 포함할 때는 마크다운 코드 블록을 사용하세요
5. 기술 블로그답게 전문적이지만 읽기 쉽게 작성해주세요

## 응답 형식 (매우 중요!)
반드시 유효한 JSON 형식으로만 응답하세요.

**중요**: content 필드의 모든 텍스트는 올바르게 이스케이프되어야 합니다.
- 줄바꿈: \\n
- 탭: \\t  
- 큰따옴표: \\"
- 백슬래시: \\\\
- 일반 공백만 사용 (특수 유니코드 공백 금지)

응답 형식:
{
  "title": "블로그 제목",
  "content": "마크다운 본문"
}

JSON 규칙:
- JSON 바깥에 어떤 텍스트도 넣지 마세요
- 코드 블록(\`\`\`json)으로 감싸지 마세요
- content의 모든 줄바꿈은 \\n으로 표현
- content의 큰따옴표는 \\"로 이스케이프
- 일반 ASCII 공백(0x20)만 사용하고 특수 공백 문자 사용 금지
`.trim();
};

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
