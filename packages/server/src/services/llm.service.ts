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

export async function generateBlogPost(
  summary: string,
  prBody: string | null,
  diff: string
): Promise<string> {
  try {
    const cleanedPRBody = cleanPRBody(prBody);
    const cleanedDiff = cleanDiff(diff);
    const cleanedSummary = summary.trim();

    const prompt = `다음은 GitHub Pull Request의 요약, 본문, 그리고 코드 변경사항(diff)입니다. 이를 바탕으로 기술 블로그 글을 작성해주세요.

# 기술 블로그 템플릿 구조

블로그 글은 다음 섹션들을 포함해야 한다:

1. 제목 (Title)
- 변경 사항의 주제와 목적을 명확하게 요약한다.
- 지나치게 기술적이기보다는 핵심 방향성을 나타낸다.

2. 소개 (Introduction)
- 이 변경이 왜 필요했는지 한 문단으로 설명한다.
- 문제의 배경, 기능의 목적, 이번 작업의 맥락을 포함한다.

3. 배경 (Background)
- 해결하려는 문제가 무엇인지, 어떤 버그나 UX 문제였는지 상세히 서술.
- 기존 코드 구조의 한계나 비효율을 설명한다.
- 관련하여 참고할 수 있는 이론적 지식이 있다면 포함한다.

4. 접근 방식 (Approach)
- 어떤 방법론을 선택했는지 설명한다.
- 왜 이 전략이 적합했는지 기술적 근거를 포함한다.
- 대안이 있었다면 왜 제외했는지 설명한다.

5. 기술 구현 상세 (Technical Details)
- 핵심 코드 조각을 근거와 함께 설명한다.
- Before / After 비교를 통해 구조 변화나 로직 개선을 보여준다.
- 컴포넌트, 훅, API 호출, 상태 흐름 등을 설명한다.

6. 결과 (Outcome)
- 성능 향상, 버그 해결, 유지보수성 개선 등 구체적 효과를 정리한다.
- 가능하다면 수치 기반 평가(예: 렌더링 횟수 감소)를 포함한다.

7. 회고 (Reflection)
- 작업 중 느낀 점, 배운 점, 아쉬운 점, 후속 개선 방향 등을 기록한다.

항상 위 구조를 기반으로 작성하며, 필요에 따라 하위 항목을 확장할 수 있다.

---

PR 요약:
${cleanedSummary}

PR 본문:
${cleanedPRBody}

코드 변경사항 (diff):
${cleanedDiff}

위 정보를 바탕으로 기술 블로그 글을 작성해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a technical blog writer that creates engaging and informative blog posts about code changes. Always respond in Korean. Write in a clear, professional style suitable for a technical blog.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const blogPost = completion.choices[0]?.message?.content;

    if (!blogPost) {
      throw new AppError(500, "블로그 글 생성에 실패했습니다.");
    }

    return blogPost;
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
      `블로그 글 생성 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
