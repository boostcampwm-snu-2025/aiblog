import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface BlogGenerationRequest {
  commitMessage: string;
  commitDiff: string;
  filesChanged: string[];
  repoName?: string;
  repoDescription?: string;
}

export interface BlogGenerationResponse {
  title: string;
  content: string;
  summary?: string;
}

/**
 * 커밋 정보를 기반으로 블로그 글을 생성합니다.
 */
export async function generateBlogFromCommit(
  request: BlogGenerationRequest
): Promise<BlogGenerationResponse> {
  const { commitMessage, commitDiff, filesChanged, repoName, repoDescription } = request;

  const prompt = `당신은 개발자의 커밋 내역을 분석하여 기술 블로그 글을 작성하는 AI 어시스턴트입니다.

아래 커밋 정보를 바탕으로 개발 과정과 기술적 인사이트를 담은 블로그 글을 작성해주세요.

## 커밋 정보
- 커밋 메시지: ${commitMessage}
- 변경된 파일: ${filesChanged.join(', ')}
${repoName ? `- 저장소: ${repoName}` : ''}
${repoDescription ? `- 저장소 설명: ${repoDescription}` : ''}

## 변경 내용 (diff):
\`\`\`
${commitDiff.length > 3000 ? commitDiff.substring(0, 3000) + '\n... (truncated)' : commitDiff}
\`\`\`

## 요구사항
1. 제목: 간결하고 명확한 제목 (한글, 30자 이내)
2. 본문: Markdown 형식으로 작성
3. 구조:
   - 도입부: 무엇을 했는지 요약
   - 배경: 왜 이 작업이 필요했는지
   - 구현: 어떻게 구현했는지 (코드 예시 포함)
   - 결과: 어떤 효과가 있었는지
4. 톤: 친근하고 이해하기 쉽게
5. 길이: 500-800자

출력 형식 (반드시 이 형식을 따라주세요):
---
title: [제목]
summary: [한 줄 요약]
---
[본문 내용]`;

  try {
    // Gemini API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    // Gemini 모델 가져오기
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 프롬프트 생성
    const fullPrompt = `당신은 개발자의 커밋 내역을 분석하여 기술 블로그 글을 작성하는 전문 AI 어시스턴트입니다.

${prompt}`;

    // Gemini API 호출
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedText = response.text();

    // 생성된 텍스트에서 제목, 요약, 본문 파싱
    const parsed = parseBlogContent(generatedText);

    return parsed;
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw new Error('블로그 생성 중 오류가 발생했습니다.');
  }
}

/**
 * 생성된 블로그 텍스트를 파싱하여 제목, 요약, 본문으로 분리합니다.
 */
function parseBlogContent(text: string): BlogGenerationResponse {
  const lines = text.split('\n');
  let title = '';
  let summary = '';
  let content = '';
  let inFrontmatter = false;
  let contentStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Frontmatter 시작
    if (line.trim() === '---' && !inFrontmatter && !contentStarted) {
      inFrontmatter = true;
      continue;
    }

    // Frontmatter 종료
    if (line.trim() === '---' && inFrontmatter) {
      inFrontmatter = false;
      contentStarted = true;
      continue;
    }

    // Frontmatter 내용 파싱
    if (inFrontmatter) {
      if (line.startsWith('title:')) {
        title = line.substring(6).trim();
      } else if (line.startsWith('summary:')) {
        summary = line.substring(8).trim();
      }
      continue;
    }

    // 본문 내용
    if (contentStarted) {
      content += line + '\n';
    }
  }

  // Frontmatter가 없는 경우 대체 파싱
  if (!title) {
    const firstLine = lines[0]?.trim();
    if (firstLine?.startsWith('#')) {
      title = firstLine.replace(/^#+\s*/, '');
      content = lines.slice(1).join('\n');
    } else {
      title = '커밋 분석 블로그';
      content = text;
    }
  }

  return {
    title: title || '커밋 분석 블로그',
    content: content.trim(),
    summary: summary || undefined,
  };
}
