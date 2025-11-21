import OpenAI from "openai";
import { AppError } from "../utils/errors";
import { env } from "../config/env";
import { supabase } from "../supabaseClient";

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

export type GeneratedBlogPost = {
  title: string;
  content: string;
};

export async function generateBlogPost(
  summary: string,
  prBody: string | null,
  diff: string
): Promise<GeneratedBlogPost> {
  try {
    const cleanedPRBody = cleanPRBody(prBody);
    const cleanedDiff = cleanDiff(diff);
    const cleanedSummary = summary.trim();

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cleanedSummary,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    const { data: ragDocs, error: ragError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5,
      }
    );
    if (ragError) {
      throw new AppError(500, `Supabase RAG error: ${ragError.message}`);
    }

    const contextText =
      ragDocs?.map((d: any) => `- ${d.content}`).join("\n") ??
      "(no internal documents found)";

    const systemPrompt = `
      You are a hybrid RAG + WebSearch technical writer assistant that produces 
      fully polished, developer-friendly blog posts.
      
      Your writing style must resemble real-world engineering blog posts 
      (ex. Toss Tech Blog, Kakao Tech Blog, Naver D2).  
      This means:
      - 자연스럽고 매끄러운 흐름  
      - 도입부에서 문제 상황/배경을 친절하게 설명  
      - 중간에 맥락 전환 문장 사용 (“이를 해결하기 위해…”, “하지만 문제가 있었다…”)  
      - 단순 나열이 아닌 내러티브 기반 설명  
      - 실제 개발자 경험처럼 보이는 인사이트 추가  
      - 구조화는 유지하되, 글 전체가 “스토리처럼” 읽혀야 함
      
      You have two knowledge sources:
      
      1) INTERNAL DOCUMENTS  
         - Provided below as context.  
         - Use these first (writing style, terminology, patterns).
      
      2) EXTERNAL WEB (web_browsing tool)  
         - Only if internal documents + PR info are insufficient.  
         - Fetch concise, accurate, and relevant technical details.
      
      --- INTERNAL CONTEXT ---
      ${contextText}
      ----------------------------------------------


      ## IMPORTANT:
      The FINAL ANSWER MUST BE RETURNED **ONLY** as strict JSON:

      {
        "title": "<생성된 블로그 제목>",
        "content": "<최종 블로그 글 내용>"
      }

      - No Markdown fences.
      - No additional text.
      - No explanation outside this object.
      - "content" should be a complete blog post ready for publishing.

      
      # Writing Workflow (Mandatory)
      
      Follow this exact workflow:
      
      ### 1. 블로그 제목 생성
      - PR의 핵심적인 기술 변화와 문제 해결 포인트를 한 문장으로 요약하는 제목 1개 작성.
      - 단순 정보 나열형(X) → 개발자가 글을 읽고 싶게 만드는 흥미 요소 포함(O)
      
      ### 2. 핵심 개념 정리
      - 본문에 필요한 기술 개념들을 추출.
      - 내부 자료와 PR 정보에서 설명이 충분하면 그대로 사용.
      - 부족하면 web_browsing으로 필요한 개념만 검색.
      - “개념 이해하기” 섹션을 본문 앞에 배치하되, 
        **블로그 독자를 위한 자연스러운 설명**을 제공할 것.
      
      ### 3. 도입부 (Introduction)
      - PR이 해결하려는 문제·기존 한계·배경을 독자가 쉽게 공감할 수 있게 서술.
      - “왜 이 작업이 필요했는가?”를 자연스럽게 서사 형태로 설명.
      - PR에서 다룬 기능이 서비스에서 어떤 역할을 하는지도 맥락으로 제공.
      
      ### 4. 본문 (Implementation / Improvements)
      - 단순 나열이 아니라 **맥락 + 설명 + 코드 예시** 흐름을 지킬 것.
      - 각 단계는 “왜 이렇게 했는지(Reasoning)”와 함께 기술.
      - 실제 개발자가 읽는 글처럼 자연스럽고 기술적으로 정확하게.
      
      ### 5. 결론 (Wrap-up)
      - 이번 개선이 서비스/경험/안정성에 가져오는 의미를 정리.
      - 앞으로의 방향성이나 고려사항을 간단하게 언급.
      
      # Style Rules
      
      - Always write in natural, polished Korean suitable for a mid-senior developer.
      - Paragraphs should flow logically with smooth transitions.
      - Don’t produce a dry report. Produce a readable, engaging engineering blog post.
      - Do not invent facts; use internal docs first, PR data second, external web last.
      - If information is insufficient even after browsing, say:
        "제공된 정보만으로는 확실한 결론을 내리기 어렵습니다."
      
      # Final Goal
      → “블로그 게시가 가능한 수준”의 고품질 기술 글을 만들어라.  
      → 제목은 마크다운 h1 태그 ('#')로 작성해야 하고, '제목 선정:' 등의 불필요한 prefix는 금지한다.
      → 소제목, 문단, 연결 구조, 도입부/본문/결론이 모두 자연스럽고 완성도 높아야 한다.
      `;

    const userPrompt = `다음 정보를 바탕으로 기술 블로그 글을 작성하세요.

# 입력 요약
${cleanedSummary}

# PR 본문
${cleanedPRBody}

# 코드 변경사항 (diff)
${cleanedDiff}
`;

    const completion = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const raw = completion.output_text;

    if (!raw) {
      throw new AppError(500, "블로그 글 생성에 실패했습니다.");
    }

    // Parse strict JSON: { "title": string, "content": string }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new AppError(
        500,
        "LLM 응답 파싱 실패: JSON 형식의 title, content가 필요합니다."
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as any).title !== "string" ||
      typeof (parsed as any).content !== "string"
    ) {
      throw new AppError(
        500,
        "LLM 응답 검증 실패: title과 content 문자열 필드가 필요합니다."
      );
    }

    const result: GeneratedBlogPost = {
      title: (parsed as any).title.trim(),
      content: (parsed as any).content.trim(),
    };

    if (!result.title || !result.content) {
      throw new AppError(
        500,
        "LLM 응답 검증 실패: title 또는 content가 비어있습니다."
      );
    }

    return result;
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
