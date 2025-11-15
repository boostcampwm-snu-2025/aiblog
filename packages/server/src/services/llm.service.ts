import OpenAI from "openai";
import { AppError } from "../utils/errors";
import { env } from "../config/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function generatePRSummary(
  prBody: string | null,
  diff: string
): Promise<string> {
  try {
    const cleanedPRBody = cleanPRBody(prBody);
    const cleanedDiff = cleanDiff(diff);

    const prompt = `다음은 GitHub Pull Request의 본문과 코드 변경사항(diff)입니다. 이를 바탕으로 구조화된 요약을 생성해주세요.

요약 템플릿:
## 변경 사항 요약
- 주요 변경 내용을 간결하게 나열

## 기술적 세부사항
- 코드 변경의 핵심 포인트 설명

## 영향 범위
- 이 변경이 영향을 미치는 부분

## 추가 고려사항
- 리뷰어가 주의깊게 봐야 할 부분이나 질문사항

---

PR 본문:
${cleanedPRBody}

코드 변경사항 (diff):
${cleanedDiff}

위 정보를 바탕으로 위 템플릿에 맞춰 요약을 생성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes GitHub Pull Requests in a structured format. Always respond in Korean.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const summary = completion.choices[0]?.message?.content;

    if (!summary) {
      throw new AppError(500, "LLM 응답을 생성하는데 실패했습니다.");
    }

    return summary;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof OpenAI.APIError) {
      throw new AppError(
        500,
        `OpenAI API 오류: ${error.message || "알 수 없는 오류"}`
      );
    }

    throw new AppError(
      500,
      `요약 생성 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

function cleanPRBody(prBody: string | null): string {
  if (!prBody) {
    return "PR 본문이 없습니다.";
  }

  let cleaned = prBody.replace(/```[\s\S]*?```/g, "[코드 블록 제거됨]");

  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, "[URL 제거됨]");

  const maxLength = 2000;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength) + "... (내용이 길어 일부 생략됨)";
  }

  return cleaned.trim();
}

function cleanDiff(diff: string): string {
  if (!diff) {
    return "변경사항이 없습니다.";
  }

  const maxLength = 8000;
  let cleaned = diff;

  if (cleaned.length > maxLength) {
    const files = cleaned.split(/^diff --git/m);
    let truncated = "";
    let currentLength = 0;

    for (const file of files) {
      if (currentLength + file.length > maxLength) {
        truncated += "\n... (추가 변경사항이 있어 일부 생략됨)";
        break;
      }
      truncated += (truncated ? "\ndiff --git" : "") + file;
      currentLength += file.length;
    }

    cleaned = truncated;
  }

  return cleaned.trim();
}
