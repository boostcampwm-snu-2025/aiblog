# AI Blog 개발 계획서

## 프로젝트 개요
GitHub 커밋 기록을 기반으로 LLM을 활용하여 자동으로 블로그 콘텐츠를 생성하고 관리하는 스마트 블로그 시스템

---

## 주요 기능 요구사항

### 1. LLM 연동 블로그 생성
- **커밋별 블로그 생성 버튼**
  - 각 커밋 항목에 "블로그 생성" 버튼 추가
  - 버튼 클릭 시 해당 커밋의 변경사항을 LLM에 전달
  - LLM이 커밋 내용을 분석하여 블로그 글 자동 생성

### 2. 투 페인(Two-Pane) UI 구조
- **왼쪽 패널**: 커밋 목록
  - 기존 ActivityList 컴포넌트 활용
  - 각 커밋에 "블로그 생성" 버튼 표시
  - 선택된 커밋 하이라이트

- **오른쪽 패널**: 생성된 블로그 미리보기
  - Markdown 렌더링 지원
  - 블로그 내용 편집 기능 (선택)
  - 반응형 디자인으로 부드러운 전환 효과

### 3. 블로그 게시 관리
- **게시 결정 버튼**
  - 블로그 미리보기 하단에 배치
  - "게시하기" 버튼: 승인된 블로그를 저장/게시
  - "취소하기" 버튼: 생성된 내용 폐기

- **게시된 블로그 관리**
  - 게시된 블로그 목록 조회
  - 수정 및 삭제 기능

### 4. 페이지 네비게이션
- **상단 토글 버튼**
  - "커밋 목록 보기" ↔ "블로그 목록 보기" 전환
  - 현재 활성화된 페이지 표시
  - 부드러운 전환 애니메이션

### 5. n8n 자동화 (선택 기능)
- **자동 블로그 생성 워크플로우**
  - GitHub Webhook 연동
  - 새 커밋 푸시 시 자동으로 블로그 생성
  - 생성된 블로그 자동 저장 또는 검토 대기열에 추가

---

## 기술 스택

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI 라이브러리**: 커스텀 컴포넌트 (필요시 추가)
- **Markdown 렌더러**: react-markdown (설치 필요)
- **HTTP Client**: fetch API

### Backend
- **Runtime**: Node.js + Express
- **언어**: TypeScript
- **GitHub API**: @octokit/rest
- **LLM API**: Google Gemini API (gemini-pro) ✅
- **환경 변수**: dotenv

### Automation (선택)
- **Workflow Tool**: n8n
- **Integration**: GitHub Webhook + n8n HTTP Request

---

## 코딩 컨벤션

> **참고**: [GitHub Issue #22](https://github.com/boostcampwm-snu-2025/aiblog/issues/22) 기준

### 필수 준수 사항

#### 1. 파일 네이밍
- **React 컴포넌트**: PascalCase + `.tsx` 확장자
  - 예: `BlogPreviewPanel.tsx`, `ActivityItem.tsx`
- **커스텀 훅**: camelCase + `.ts` 확장자
  - 예: `useBlogGeneration.ts`, `useCommitData.ts`
- **유틸리티/라이브러리**: camelCase + `.ts`
  - 예: `api.ts`, `helpers.ts`

#### 2. 함수형 컴포넌트만 사용
- **클래스형 컴포넌트 금지**
- React Hooks 학습 및 활용에 집중
- 모든 컴포넌트는 `function` 또는 화살표 함수로 작성

```tsx
// ✅ 권장
export default function BlogPreviewPanel({ content }: Props) {
  return <div>{content}</div>;
}

// ❌ 금지
class BlogPreviewPanel extends React.Component {
  render() { return <div>{this.props.content}</div>; }
}
```

#### 3. useEffect 의존성 배열 필수 명시
- **절대 생략 금지**
- 의존성 배열을 명시하여 예상치 못한 재렌더링 방지

```tsx
// ✅ 권장
useEffect(() => {
  fetchBlogData();
}, [owner, repo, commitSha]);

// ❌ 금지
useEffect(() => {
  fetchBlogData();
}); // 의존성 배열 생략
```

#### 4. 환경 변수 보안 관리
- **`.env` 파일을 `.gitignore`에 반드시 포함**
- API 키, 토큰 등 민감 정보는 절대 커밋하지 않음
- `.env.example` 파일로 필요한 환경 변수 템플릿 제공

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 권장 사항 (선택)

#### 폴더 구조
- 기능별 또는 도메인별 자유 구성
- 현재 구조: `src/components/`, `src/lib/`, `src/routes/`

#### 스타일링
- 자유 선택: Tailwind CSS, CSS Modules, styled-components 등
- 일관성 유지 권장

#### 상태 관리
- Context API, Redux, Zustand 등 자유 선택
- 프로젝트 규모 고려하여 선택

#### API 통신
- fetch API, axios 등 자유 선택
- 현재: fetch API 사용 중

### 학습 체크리스트

#### React Hooks
- [x] useState - 상태 관리 기본
- [x] useEffect - 사이드 이펙트 처리
- [ ] useReducer - 복잡한 상태 로직
- [ ] useContext - 전역 상태 공유
- [ ] useMemo - 성능 최적화
- [ ] useCallback - 함수 메모이제이션
- [ ] 커스텀 훅 - 로직 재사용

#### Backend
- [x] Express 라우팅 기본
- [x] GitHub API 연동 (@octokit/rest)
- [ ] LLM API 연동 (OpenAI/Anthropic)
- [ ] 에러 핸들링 미들웨어
- [ ] 환경 변수 관리 (dotenv)

---

## 개발 단계

### Phase 1: LLM 연동 기반 구축 ✅ 완료
**목표**: LLM API 연동 및 블로그 생성 기능 구현

#### 백엔드 작업
- [x] LLM API 연동 모듈 작성 ✅
  - **Google Gemini API** (gemini-pro) 선택
  - 환경 변수에 API 키 설정 (`GEMINI_API_KEY`)
  - 프롬프트 템플릿 작성 (커밋 정보 → 블로그 글)
  - 파일: `src/services/llm.ts`

- [x] 블로그 생성 엔드포인트 개발 ✅
  - `POST /api/blog/generate`
  - 요청: `{ owner, repo, commitSha }`
  - 응답: `{ success, data: { title, content, summary, metadata } }`
  - 파일: `src/routes/blog.ts`

- [x] 커밋 상세 정보 조회 API ✅
  - GitHub API를 통해 커밋 diff, 파일 변경 내역 가져오기
  - LLM에 전달할 컨텍스트 생성
  - 파일: `src/services/github.ts`

#### 프론트엔드 작업
- [x] LLM API 호출 함수 작성 (`src/lib/api.ts`) ✅
  - `generateBlog(owner, repo, commitSha)` 함수 추가
  - TypeScript 타입 정의 완료

- [x] ActivityItem 컴포넌트 수정 ✅
  - "블로그 생성" 버튼 추가
  - 로딩 상태 표시 (generating, error)
  - 에러 핸들링

#### 추가 개선 사항
- [x] RepoInput 최적화 ✅
  - 타이핑 시마다 검색되는 문제 해결
  - "불러오기" 버튼 클릭 시에만 검색 실행
  - 입력 필드와 실제 검색 상태 분리

---

### Phase 2: 투 페인 UI 구현 ✅ 완료
**목표**: 커밋 목록과 블로그 미리보기를 나란히 표시

#### 컴포넌트 구조 (구현 완료)
```
App
├── TwoColumnLayout ✅
│   ├── 왼쪽 패널: ActivityList (커밋 목록)
│   └── 오른쪽 패널: BlogPreviewPanel (블로그 미리보기)
│       ├── Markdown 렌더링 (react-markdown)
│       └── BlogActions (게시/취소 버튼)
```

#### 작업 항목
- [x] `react-markdown` 패키지 설치 ✅
  - `react-markdown` + `remark-gfm` 설치
  - GitHub Flavored Markdown 지원

- [x] `TwoColumnLayout` 컴포넌트 생성 ✅
  - CSS Grid 레이아웃 (1fr 1fr)
  - 반응형 디자인 (화면 크기 < 1024px 시 세로 배치)
  - 패널 헤더 및 스크롤 영역 분리
  - 파일: `src/components/TwoColumnLayout.tsx`

- [x] `BlogPreviewPanel` 컴포넌트 생성 ✅
  - Markdown 렌더링 (코드 블록, 링크, 헤더 등 스타일링)
  - 빈 상태 메시지 표시
  - 메타데이터 표시 (작성자, 커밋 SHA, 파일 수)
  - 게시/취소 버튼 구현
  - 파일: `src/components/BlogPreviewPanel.tsx`

- [x] 상태 관리 개선 ✅
  - `generatedBlog` 상태로 블로그 데이터 관리
  - `handlePublish`, `handleCancel` 함수 구현
  - Alert 대신 패널에 직접 표시

#### 다크모드 지원 추가 🎨
- [x] `useDarkMode` 커스텀 훅 생성 ✅
  - 시스템 다크모드 설정 자동 감지
  - 실시간 변경 감지
  - 파일: `src/hooks/useDarkMode.ts`

- [x] 모든 컴포넌트에 다크모드 스타일 적용 ✅
  - `TwoColumnLayout`: 패널 배경, 테두리, 헤더 색상
  - `BlogPreviewPanel`: 본문, 코드 블록, 버튼 색상
  - `ActivityItem`: 카드 배경, 링크 색상
  - `RepositoryList`: 저장소 카드, 호버 효과

- [x] 다크모드 색상 팔레트 정의 ✅
  - 배경: `#1e1e1e` / `#fff`
  - 서브 배경: `#2a2a2a` / `#f9fafb`
  - 테두리: `#444` / `#e5e7eb`
  - 텍스트: `#d4d4d4` / `#333`
  - 링크: `#5BA3F5` / `#0066cc`

---

### Phase 3: 블로그 게시 기능 ✅ 완료
**목표**: 생성된 블로그를 저장하고 관리

#### 백엔드 작업
- [x] 블로그 저장 시스템 설계 ✅
  - JSON 파일 방식 선택 (`data/blogs.json`)
  - 저장 형식: `{ id, title, content, summary, commitSha, owner, repo, author, filesChanged, stats, published, createdAt, updatedAt, publishedAt }`
  - 파일: `src/services/blogStorage.ts`

- [x] 블로그 CRUD API 개발 ✅
  - `POST /api/blog/publish` - 블로그 게시
  - `GET /api/blog/list` - 게시된 블로그 목록 (페이징 지원)
  - `GET /api/blog/:id` - 특정 블로그 조회
  - `PUT /api/blog/:id` - 블로그 수정
  - `DELETE /api/blog/:id` - 블로그 삭제
  - 파일: `src/routes/blog.ts`

#### 프론트엔드 작업
- [x] BlogActions 컴포넌트 구현 ✅
  - BlogPreviewPanel에 게시/취소 버튼 통합
  - "게시하기" 버튼 클릭 시 블로그 저장 (`publishBlog` API 호출)
  - "취소하기" 버튼 클릭 시 미리보기 초기화
  - 성공/실패 알림 메시지 표시

- [x] BlogListPage 컴포넌트 생성 ✅
  - 게시된 블로그 목록 표시
  - 카드 형식 레이아웃 (그리드)
  - 페이지네이션 UI (이전/다음 버튼)
  - 다크모드 지원
  - 파일: `src/components/BlogListPage.tsx`

- [x] BlogDetailModal 컴포넌트 생성 ✅
  - 블로그 상세 내용 모달로 표시
  - Markdown 렌더링
  - 메타데이터 표시 (작성자, 커밋, 날짜, 통계)
  - 삭제 버튼 구현
  - 다크모드 지원
  - 파일: `src/components/BlogDetailModal.tsx`

- [x] API 함수 추가 ✅
  - `publishBlog()` - 블로그 게시
  - `fetchBlogList()` - 블로그 목록 조회
  - `fetchBlogDetail()` - 블로그 상세 조회
  - `deleteBlog()` - 블로그 삭제
  - 파일: `src/lib/api.ts`

---

### Phase 4: 페이지 네비게이션 ✅ 완료
**목표**: 커밋 목록과 블로그 목록 페이지 간 전환

#### 작업 항목
- [x] Header 컴포넌트 생성 ✅
  - 토글 버튼: "커밋 분석" / "블로그 목록"
  - 현재 페이지 하이라이트 (활성 버튼 강조)
  - 다크모드 지원
  - 파일: `src/components/Header.tsx`

- [x] 페이지 상태 관리 ✅
  - `currentView: 'commits' | 'blogs'` 상태 추가
  - 조건부 렌더링 (App.tsx)
  - ViewMode 타입 정의 및 export

- [x] 전환 애니메이션 ✅
  - CSS keyframes를 활용한 fadeIn 애니메이션
  - 부드러운 fade-in/slide-up 효과
  - 파일: `src/index.css` (fadeIn 애니메이션 정의)

- [x] 레이아웃 일관성 개선 ✅
  - 모든 뷰에 동일한 padding 적용
  - Header 위치 고정
  - body 스타일 조정 (center 정렬 제거)

---

### Phase 5: n8n 자동화 (선택)
**목표**: GitHub 푸시 시 자동 블로그 생성

#### n8n 워크플로우 설계
1. **GitHub Webhook Trigger**
   - 이벤트: `push` to main branch

2. **Commit 정보 추출**
   - 최신 커밋 SHA, 메시지, diff 가져오기

3. **HTTP Request to Backend**
   - `POST /api/blog/generate` 호출

4. **자동 저장 또는 알림**
   - 생성된 블로그 자동 저장
   - 또는 Slack/이메일로 검토 요청

#### 작업 항목
- [ ] n8n 설치 및 설정
  - Docker Compose로 로컬 실행

- [ ] GitHub Webhook 설정
  - Repository Settings → Webhooks
  - Payload URL: n8n webhook URL

- [ ] 워크플로우 구성
  - n8n 워크플로우 작성
  - 테스트 및 디버깅

---

## API 설계

### Backend Endpoints

#### 1. 블로그 생성
```http
POST /api/blog/generate
Content-Type: application/json

{
  "owner": "dev-pyun",
  "repo": "aiblog",
  "commitSha": "abc123..."
}

Response:
{
  "success": true,
  "data": {
    "title": "커밋 분석: 새로운 기능 추가",
    "content": "# Markdown 형식의 블로그 내용...",
    "summary": "요약 텍스트"
  }
}
```

#### 2. 블로그 게시
```http
POST /api/blog/publish
Content-Type: application/json

{
  "title": "블로그 제목",
  "content": "Markdown 내용",
  "commitSha": "abc123...",
  "metadata": {
    "owner": "dev-pyun",
    "repo": "aiblog"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "blog-uuid-123",
    "publishedAt": "2025-11-15T10:00:00Z"
  }
}
```

#### 3. 블로그 목록 조회
```http
GET /api/blog/list?page=1&per_page=10

Response:
{
  "items": [
    {
      "id": "blog-uuid-123",
      "title": "블로그 제목",
      "summary": "요약",
      "commitSha": "abc123",
      "publishedAt": "2025-11-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 25
  }
}
```

---

## 데이터 모델

### Blog Post
```typescript
interface BlogPost {
  id: string;                    // UUID
  title: string;                 // 블로그 제목
  content: string;               // Markdown 형식 본문
  summary?: string;              // 요약 (선택)
  commitSha: string;             // 연결된 커밋
  owner: string;                 // GitHub owner
  repo: string;                  // GitHub repo
  published: boolean;            // 게시 여부
  createdAt: Date;               // 생성 시간
  updatedAt: Date;               // 수정 시간
  publishedAt?: Date;            // 게시 시간
}
```

### LLM Generation Request
```typescript
interface GenerationRequest {
  commitDiff: string;            // git diff 내용
  commitMessage: string;         // 커밋 메시지
  filesChanged: string[];        // 변경된 파일 목록
  repoContext?: {                // 추가 컨텍스트
    name: string;
    description: string;
    language: string;
  };
}
```

---

## LLM 프롬프트 템플릿

### 기본 프롬프트
```
당신은 개발자의 커밋 내역을 분석하여 기술 블로그 글을 작성하는 AI 어시스턴트입니다.

아래 커밋 정보를 바탕으로 개발 과정과 기술적 인사이트를 담은 블로그 글을 작성해주세요.

## 커밋 정보
- 커밋 메시지: {commitMessage}
- 변경된 파일: {filesChanged}
- 변경 내용 (diff):
{commitDiff}

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

출력 형식:
---
title: [제목]
---
[본문]
```

---

## 개발 환경 설정

### 필요한 패키지 설치

#### Frontend
```bash
npm install react-markdown remark-gfm
npm install @types/node --save-dev
```

#### Backend
```bash
npm install openai        # OpenAI 사용 시
npm install @anthropic-ai/sdk  # Claude 사용 시
npm install uuid
npm install @types/uuid --save-dev
```

### 환경 변수 (.env)
```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret

# LLM API
OPENAI_API_KEY=sk-...           # OpenAI 사용 시
ANTHROPIC_API_KEY=sk-ant-...    # Claude 사용 시
LLM_PROVIDER=openai             # 'openai' or 'anthropic'

# Server
PORT=3000

# n8n (선택)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/...
```

---

## 테스트 계획

### Unit Tests
- [ ] LLM API 호출 함수 테스트
- [ ] 블로그 생성 로직 테스트
- [ ] API 엔드포인트 테스트

### Integration Tests
- [ ] GitHub API → LLM → 블로그 생성 전체 플로우
- [ ] 블로그 게시 및 조회 플로우

### E2E Tests (선택)
- [ ] 커밋 선택 → 블로그 생성 → 게시 전체 시나리오

---

## 배포 계획

### Development
- Frontend: `npm run dev` (Vite dev server)
- Backend: `npm run dev:server` (ts-node-dev)

### Production
- Frontend: Vercel 또는 Netlify
- Backend: Heroku, Railway, 또는 AWS
- 환경 변수 설정 필수

---

## 타임라인 (예상)

| Phase | 작업 내용 | 예상 소요 시간 |
|-------|----------|--------------|
| Phase 1 | LLM 연동 기반 구축 | 2-3일 |
| Phase 2 | 투 페인 UI 구현 | 1-2일 |
| Phase 3 | 블로그 게시 기능 | 1-2일 |
| Phase 4 | 페이지 네비게이션 | 0.5-1일 |
| Phase 5 | n8n 자동화 (선택) | 1-2일 |
| **총계** | | **5.5-10일** |

---

## 참고 자료

- [Google Gemini API Docs](https://ai.google.dev/docs) ✅ 사용 중
- [GitHub REST API - Commits](https://docs.github.com/en/rest/commits)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [n8n Documentation](https://docs.n8n.io/)

---

## 진행 상황 요약

### ✅ 완료된 단계
- **Phase 1: LLM 연동 기반 구축** - 100% 완료
  - Google Gemini API 연동 완료
  - 커밋별 블로그 생성 기능 구현
  - 프론트엔드 UI 개선 (RepoInput 최적화)

- **Phase 2: 투 페인 UI 구현** - 100% 완료
  - 좌우 2열 레이아웃 구현 (TwoColumnLayout)
  - Markdown 블로그 미리보기 (BlogPreviewPanel)
  - 다크모드 지원 (useDarkMode 커스텀 훅)
  - 반응형 디자인 적용
  - 게시/취소 버튼 구현

- **Phase 3: 블로그 게시 기능** - 100% 완료
  - JSON 파일 기반 블로그 저장 시스템 구축
  - 블로그 CRUD API 5개 엔드포인트 개발
  - 블로그 목록 페이지 (페이징, 다크모드)
  - 블로그 상세 보기 모달
  - 블로그 삭제 기능

- **Phase 4: 페이지 네비게이션** - 100% 완료
  - Header 컴포넌트 with 토글 버튼
  - 커밋 분석 ↔ 블로그 목록 뷰 전환
  - CSS 애니메이션 (fadeIn 효과)
  - 레이아웃 일관성 개선

### 🚀 다음 단계: Phase 5

#### Phase 5: n8n 자동화 (선택 사항)
**목표**: GitHub 푸시 시 자동 블로그 생성

**작업 내용**:
1. n8n 워크플로우 설계
2. GitHub Webhook 설정
3. 자동화 테스트 및 디버깅

**예상 소요 시간**: 1-2일

---

**문서 버전**: 1.4
**작성일**: 2025-11-15
**마지막 업데이트**: 2025-11-15 (Phase 3, 4 완료)
**참고 이슈**: [#22 코딩 컨벤션](https://github.com/boostcampwm-snu-2025/aiblog/issues/22)
