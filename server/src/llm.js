import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 공통 옵션(원하면 조절)
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TEMPERATURE = 0.4;
const MAX_TOKENS = 700; // 블로그 스타일이면 길이를 넉넉히!

// 공통 시스템 프롬프트: "블로그 글" 톤 + 금지사항
const SYSTEM = `
당신은 한국어 기술 블로거입니다.
- 독자가 빠르게 핵심을 파악하고, 필요한 경우 더 깊게 읽을 수 있도록 구성하세요.
- 섹션/소제목을 사용하고, 불릿 리스트로 가독성을 높이세요.
- 사실 기반만 사용하세요. 제공된 정보에 없는 코드는 "추정"하거나 "지어내지" 마세요.
- 정보가 없으면 "해당 없음"으로 명시하세요.
- 최종 출력은 마크다운으로 작성하고, 너무 장황하지 않되 블로그 글처럼 자연스럽게 작성하세요.
`;

// 블로그 템플릿(커밋)
function commitTemplate({ messageHeadline, message }) {
  return `
다음 커밋 정보를 바탕으로 개발 블로그 포스트를 작성하세요.

[제약]
- 한국어 마크다운
- 총 6~10문장 분량
- 섹션 포함: "요약", "왜 이 변경이 필요했나", "주요 변경점", "영향 및 릴리스 노트", "마치며"
- 가능하면 "주요 변경점"은 불릿으로 3~6개
- 메시지에 이슈/PR 번호가 있으면 "관련 링크/이슈" 섹션에 그대로 표기
- 코드 스니펫은 메시지에 포함된 구체 내용이 없으면 생략 (절대 추측 금지)
- 마지막 줄에 태그를 해시태그 형태로 3~5개 제안 (예: #bugfix #refactor)

[입력]
Commit headline: ${messageHeadline || '(no headline)'}
Commit message:
"""
${message || '(no message)'}
"""

[출력 형식 예시]
## 요약
- (핵심 2~3문장)

## 왜 이 변경이 필요했나
- (배경/문제/의도)

## 주요 변경점
- (불릿 3~6개)

## 영향 및 릴리스 노트
- (사용자/시스템/성능/보안 측면 영향 2~4문장)

## 관련 링크/이슈
- (정보 없으면 "해당 없음")

## 마치며
- (한두 문장 개인 메모/다음 계획)

#tags: #(카테고리) #(영역) #(유형)
`;
}

// 블로그 템플릿(PR)
function prTemplate({ title, body }) {
  return `
다음 Pull Request 정보를 바탕으로 개발 블로그 포스트를 작성하세요.

[제약]
- 한국어 마크다운
- 총 7~12문장 분량
- 섹션 포함: "요약", "변경 범위", "주요 변경점", "검토 포인트/리스크", "영향 및 배포 체크리스트", "다음 단계"
- "주요 변경점"은 불릿 3~6개
- 본문에 참고 이슈/체크리스트가 있으면 "관련 링크/이슈" 섹션에 표기
- 정보가 없으면 해당 섹션은 "해당 없음"으로 명시
- 마지막에 해시태그 3~5개

[입력]
PR 제목: ${title || '(no title)'}
PR 본문:
"""
${body || '(no body)'}
"""

[출력 형식 예시]
## 요약
- (핵심 2~3문장)

## 변경 범위
- (영향 받는 모듈/도메인/범위 설명, 정보 없으면 "해당 없음")

## 주요 변경점
- (불릿 3~6개)

## 검토 포인트/리스크
- (테스트/성능/롤백/마이그레이션 등)

## 영향 및 배포 체크리스트
- (마이그레이션/플래그/모니터링/롤백 플랜 등, 없으면 "해당 없음")

## 관련 링크/이슈
- (정보 없으면 "해당 없음")

## 다음 단계
- (후속 작업/추가 리팩터/문서화)

#tags: #(카테고리) #(영역) #(유형)
`;
}

export async function summarizeCommit(commit) {
  const { message, messageHeadline } = commit || {};
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: commitTemplate({ messageHeadline, message }) },
    ],
  });
  return r.choices[0]?.message?.content?.trim() || '';
}

export async function summarizePR(pr) {
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: prTemplate({ title: pr?.title, body: pr?.body }) },
    ],
  });
  return r.choices[0]?.message?.content?.trim() || '';
}
