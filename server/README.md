# Server - Backend API

Smart Blog의 백엔드 API 서버입니다. Express.js와 TypeScript로 구축되었으며, GitHub API 통합 및 AI 요약 기능을 제공합니다.

## 디렉토리 구조

```
server/
├── package.json
├── tsconfig.json
├── data/                # 포스트 데이터 저장 디렉토리
└── src/
    ├── index.ts         # Express 서버 진입점, API 라우트 정의
    ├── github.ts        # GitHub API 통합 (브랜치, 커밋, PR 조회)
    ├── summarize.ts     # OpenAI를 이용한 AI 요약 기능
    ├── posts.ts         # 포스트 CRUD 로직
    ├── cache.ts         # ETag 기반 캐싱 구현
    └── types.ts         # TypeScript 타입 정의
```

## 주요 기능

### GitHub API 통합

github.ts 모듈은 GitHub REST API v3를 사용하여 저장소의 활동을 조회합니다.

getRecentActivities 함수는 다음과 같이 동작합니다:

1. 저장소의 모든 브랜치 목록을 조회합니다 (최대 10개)
2. 각 브랜치에 대해 병렬로 최근 커밋을 가져옵니다
3. Pull Request 목록을 조회하여 소스 브랜치 정보를 포함합니다
4. 모든 활동을 시간순으로 정렬하여 반환합니다

ETag를 활용한 캐싱으로 GitHub API 호출을 최적화합니다.

### AI 요약

summarize.ts 모듈은 OpenAI API를 사용하여 선택한 GitHub 활동들을 분석하고 블로그 포스트 형식으로 요약합니다. 다양한 언어와 톤을 지원합니다.

### 포스트 관리

posts.ts 모듈은 JSON 파일 기반의 간단한 데이터베이스를 사용하여 블로그 포스트를 관리합니다. data 디렉토리에 posts.json 파일로 저장됩니다.

## 환경 변수

프로젝트 루트(server 디렉토리)에 .env 파일을 생성하세요:

```
GITHUB_TOKEN=ghp_your_github_personal_access_token
OPENAI_API_KEY=sk-your_openai_api_key
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

환경 변수 설명:

- GITHUB_TOKEN: GitHub Personal Access Token (repo 권한 필요)
- OPENAI_API_KEY: OpenAI API 키
- PORT: 서버 포트 (기본값: 8080)
- CORS_ORIGIN: CORS 허용 오리진 (쉼표로 구분하여 여러 개 지정 가능)

## 설치 및 실행

의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

tsx watch 모드로 실행되어 코드 변경 시 자동으로 재시작됩니다.

## API 엔드포인트

### Health Check

```
GET /api/health
```

서버 상태를 확인합니다.

### GitHub 활동 조회

```
GET /api/github/:owner/:repo/recent
```

파라미터:
- owner: GitHub 저장소 소유자
- repo: 저장소 이름

쿼리 파라미터:
- sinceDays: 조회 기간 (일 단위, 기본값: 14)
- page: 페이지 번호 (기본값: 1)
- perPage: 페이지당 항목 수 (기본값: 20)

응답:
```json
{
  "items": [
    {
      "id": "sha-branchname",
      "type": "commit",
      "title": "커밋 메시지 제목",
      "message": "전체 커밋 메시지",
      "url": "https://github.com/...",
      "author": "작성자 이름",
      "committedAt": "2025-11-08T10:30:00Z",
      "branch": "main"
    }
  ]
}
```

### AI 요약

```
POST /api/summarize
```

요청 본문:
```json
{
  "items": [활동 배열],
  "language": "ko",
  "tone": "blog"
}
```

응답:
```json
{
  "markdown": "생성된 마크다운 콘텐츠"
}
```

### 포스트 관리

```
GET    /api/posts           # 전체 포스트 목록
GET    /api/posts/:id       # 특정 포스트 조회
POST   /api/posts           # 새 포스트 생성
PUT    /api/posts/:id       # 포스트 수정
DELETE /api/posts/:id       # 포스트 삭제
```

포스트 생성 요청 예시:
```json
{
  "title": "포스트 제목",
  "markdown": "# 마크다운 내용",
  "tags": ["tag1", "tag2"]
}
```

## 기술 스택

- Node.js: JavaScript 런타임
- Express.js 5.x: 웹 프레임워크
- TypeScript 5.x: 타입 안전성
- dotenv: 환경 변수 관리
- cors: CORS 처리
- nanoid: 고유 ID 생성
- tsx: TypeScript 실행 및 watch 모드

## 개발 참고사항

### 타입 정의

types.ts에 정의된 주요 타입:

```typescript
export type ActivityType = 'commit' | 'pr';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  message?: string;
  url: string;
  author: string;
  committedAt: string;
  branch?: string;
}
```

### 캐싱 메커니즘

cache.ts는 메모리 기반의 간단한 캐싱을 제공합니다. GitHub API 응답의 ETag를 저장하여 304 Not Modified 응답을 활용합니다. 이를 통해 API 호출 횟수를 줄이고 rate limit을 절약합니다.

### 에러 처리

각 브랜치의 커밋을 조회할 때 특정 브랜치에서 에러가 발생하더라도 다른 브랜치는 정상적으로 처리됩니다. 이를 통해 일부 브랜치에 접근 권한이 없거나 문제가 있어도 전체 요청이 실패하지 않습니다.

