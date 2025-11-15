# aiblog

## 프로젝트 구조

이 프로젝트는 모노레포 구조로 구성되어 있으며, npm workspaces를 사용합니다.

```
Smart_Blog/
└── aiblog/
    ├── package.json          # 루트 워크스페이스 설정
    ├── server/               # Express.js 백엔드 서버
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── data/             # 포스트 데이터 저장
    │   └── src/
    │       ├── index.ts      # Express 서버 진입점
    │       ├── github.ts     # GitHub API 통합 로직
    │       ├── summarize.ts  # AI 요약 기능
    │       ├── posts.ts      # 포스트 CRUD 관리
    │       ├── cache.ts      # ETag 캐싱 구현
    │       └── types.ts      # TypeScript 타입 정의
    └── web/                  # React 프론트엔드
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── index.html
        ├── public/
        └── src/
            ├── main.tsx      # React 진입점
            ├── App.tsx       # 메인 애플리케이션
            ├── api.ts        # API 클라이언트
            ├── types.ts      # TypeScript 타입 정의
            ├── styles.css    # 전역 스타일
            └── components/
                ├── RepoForm.tsx        # 저장소 검색 폼
                ├── ActivityList.tsx    # 활동 목록 표시
                ├── BlogPreview.tsx     # 블로그 미리보기
                ├── Loader.tsx          # 로딩 인디케이터
                └── ErrorBanner.tsx     # 에러 메시지 표시
```

## 주요 기능

### GitHub 활동 추적

프로젝트는 GitHub API를 통해 저장소의 최근 활동을 조회합니다. 기존에는 기본 브랜치만 조회했으나, 현재는 모든 브랜치의 활동을 통합하여 보여줍니다.

- 저장소의 모든 브랜치 조회 (최대 10개)
- 각 브랜치별 최근 커밋 정보 수집
- Pull Request 활동 추적
- 브랜치명과 함께 활동 표시
- ETag를 활용한 효율적인 API 캐싱

### AI 요약

선택한 GitHub 활동들을 OpenAI API를 통해 요약하여 블로그 포스트 초안을 생성할 수 있습니다.

### 포스트 관리

생성된 블로그 포스트를 저장, 조회, 수정, 삭제할 수 있는 CRUD 기능을 제공합니다.

## 기술 스택

### 백엔드

- Node.js
- Express.js 5.x
- TypeScript 5.x
- GitHub REST API
- OpenAI API

### 프론트엔드

- React 19.x
- TypeScript 5.x
- Vite 7.x
- ESLint

### 개발 도구

- tsx (TypeScript 실행)
- concurrently (동시 프로세스 실행)

## 설치 및 실행

### 환경 변수 설정

server 디렉토리에 `.env` 파일을 생성하고 다음 내용을 입력합니다:

```
GITHUB_TOKEN=your_github_personal_access_token
OPENAI_API_KEY=your_openai_api_key
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

### 의존성 설치

프로젝트 루트(aiblog 디렉토리)에서 다음 명령어를 실행합니다:

```bash
cd aiblog
npm install
```

npm workspaces를 사용하므로 한 번의 명령으로 모든 하위 프로젝트의 의존성이 설치됩니다.

### 개발 서버 실행

```bash
npm run dev
```

이 명령어는 백엔드 서버와 프론트엔드 개발 서버를 동시에 실행합니다.

- 백엔드: http://localhost:8080
- 프론트엔드: http://localhost:5173

개별적으로 실행하려면:

```bash
# 백엔드만 실행
cd server
npm run dev

# 프론트엔드만 실행
cd web
npm run dev
```

## API 엔드포인트

### GitHub 활동 조회

```
GET /api/github/:owner/:repo/recent
```

쿼리 파라미터:
- `sinceDays`: 조회할 기간 (일 단위, 기본값: 14)
- `page`: 페이지 번호 (기본값: 1)
- `perPage`: 페이지당 항목 수 (기본값: 20)

응답 예시:
```json
{
  "items": [
    {
      "id": "abc123-main",
      "type": "commit",
      "title": "feat: add new feature",
      "message": "feat: add new feature\n\nDetailed description...",
      "url": "https://github.com/owner/repo/commit/abc123",
      "author": "username",
      "committedAt": "2025-11-08T10:30:00Z",
      "branch": "main"
    }
  ]
}
```

### AI 요약 생성

```
POST /api/summarize
```

요청 본문:
```json
{
  "items": [...],
  "language": "ko",
  "tone": "blog"
}
```

### 포스트 관리

```
GET    /api/posts        # 포스트 목록 조회
GET    /api/posts/:id    # 특정 포스트 조회
POST   /api/posts        # 새 포스트 생성
PUT    /api/posts/:id    # 포스트 수정
DELETE /api/posts/:id    # 포스트 삭제
```

## 사용 방법 (Smart Blog 플로우)

1. 웹 애플리케이션(`http://localhost:5173`)에 접속합니다.
2. 상단 입력창에 `owner/repo` 형식으로 GitHub 저장소를 입력합니다.  
   - 예: `joosung03/netflix-clone`
3. 조회 기간(14일, 30일, 90일 등)을 선택한 뒤 **최근 커밋 보기** 버튼을 클릭합니다.
4. 좌측 **Recent Commits** 카드 목록에서 원하는 커밋/PR의 **Generate Summary** 버튼을 클릭합니다.
5. 우측 **Selected Commit** 패널의 *AI Summary* 영역에 LLM(OpenAI API)이 생성한 블로그 스타일 마크다운이 표시됩니다.
6. 내용이 마음에 들면 **Save as Blog Post** 버튼을 눌러 서버의 `/api/posts`에 포스트로 저장합니다.

## 최근 업데이트

### 멀티 브랜치 지원

이전에는 기본 브랜치의 커밋만 조회했지만, 이제는 저장소의 모든 브랜치를 조회하여 각 브랜치의 최근 활동을 통합하여 보여줍니다. 

- Activity 타입에 브랜치 정보 필드 추가
- GitHub API 로직 개선: 모든 브랜치의 커밋을 병렬로 조회
- Pull Request의 소스 브랜치 정보 포함
- UI에서 브랜치명 표시 (브랜치 아이콘과 함께)
- 브랜치별 에러 처리: 특정 브랜치 조회 실패 시에도 다른 브랜치는 정상 처리

### UX 개선

- 초기 로딩 화면에서 불필요한 empty 메시지 제거
- 실제로 검색을 실행한 후에만 "활동이 없습니다" 메시지 표시

### LLM 기반 블로그 생성 및 Smart Blog UI (2주차)

- OpenAI Chat Completions API를 사용하는 `/api/summarize` 엔드포인트를 구현하여, 선택한 커밋/PR에 대한 **블로그 형식 AI 요약**을 생성
- 프론트엔드에서 카드 형태의 **Recent Commits** 리스트와 **Selected Commit / AI Summary** 패널로 구성된 Smart Blog 레이아웃 구현
- 각 활동별 **Generate Summary** 버튼을 통해 단일 커밋/PR에 대한 요약을 트리거
- 생성된 마크다운을 미리보기로 보여주고, **Save as Blog Post** 버튼으로 `/api/posts`에 저장하는 플로우 완성

## 개발 진행 상황

### 1주차

- 프로젝트 계획 수립
- 개발 환경 구성
- GitHub 데이터 가져와서 렌더링
- 멀티 브랜치 지원 구현
- 브랜치명 표시 기능 추가

### 2주차

- OpenAI API 연동을 통한 LLM 요약 기능 구현
- GitHub 최근 커밋/PR 별 **Generate Summary** 버튼으로 블로그 글 자동 생성
- Selected Commit 패널에서 AI Summary 표시 및 **Save as Blog Post** 기능 구현
- Smart Blog 스타일의 헤더/2열 레이아웃 및 카드 기반 UI 적용

