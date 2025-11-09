# AIblog - AI-Powered GitHub Activity Blog Generator

GitHub 활동 데이터를 분석해 자동으로 개발 블로그를 생성하는 서비스

## 프로젝트 구조

```
AIblog/
├── client/          # React Frontend (To be implemented)
├── server/          # Express Backend
│   ├── src/
│   │   ├── config/      # 환경 설정
│   │   ├── controllers/ # 요청 핸들러
│   │   ├── middlewares/ # Express 미들웨어
│   │   ├── routes/      # API 라우트
│   │   ├── services/    # 비즈니스 로직
│   │   ├── types/       # TypeScript 타입 정의
│   │   ├── utils/       # 유틸리티 함수
│   │   ├── app.ts       # Express 앱 설정
│   │   └── index.ts     # 서버 진입점
│   ├── .env.example     # 환경 변수 예시
│   ├── package.json
│   └── tsconfig.json
└── package.json     # Root package.json (workspace)
```

## 시작하기

### 필수 요구사항

- Node.js >= 18.0.0
- npm or yarn

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd AIblog
```

2. 의존성 설치
```bash
npm install
```

3. 서버 환경 변수 설정
```bash
cd server
cp .env.example .env
# .env 파일을 편집하여 필요한 값 입력
```

### 개발 서버 실행

```bash
# Root에서 client와 server 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:server  # 서버만 실행
npm run dev:client  # 클라이언트만 실행 (구현 후)
```

### 서버만 실행
```bash
cd server
npm run dev
```

## API 엔드포인트

### Health Check
- `GET /api/health` - 서버 상태 확인

### GitHub API
- `GET /api/github/repos/:owner/:repo/commits` - 커밋 목록 조회
- `GET /api/github/repos/:owner/:repo/pulls` - PR 목록 조회

### Posts API (구현 예정)
- `POST /api/posts` - 블로그 포스트 생성
- `GET /api/posts` - 포스트 목록 조회
- `GET /api/posts/:id` - 특정 포스트 조회

## 개발 진행 상황

### 완료
- ✅ 프로젝트 구조 설정 (Monorepo with workspaces)
- ✅ Express 서버 구축 (TypeScript)
- ✅ GitHub API 엔드포인트 설계 (Mock data)
- ✅ CORS 설정
- ✅ 환경 변수 관리 (.env)
- ✅ 에러 핸들링 미들웨어

### 진행 중
- 🔄 GitHub 실제 API 연동
- 🔄 LLM API 연동
- 🔄 React Frontend 구축

### 예정
- 데이터베이스 연동
- 블로그 포스트 저장/조회 기능
- 프롬프트 엔지니어링
- 블로그 관리 UI

## 기술 스택

### Backend
- Express.js - 웹 프레임워크
- TypeScript - 타입 안정성
- dotenv - 환경 변수 관리
- cors - CORS 설정
- helmet - 보안 미들웨어
- morgan - 로깅

### Frontend (예정)
- React 18
- Vite
- TailwindCSS

## 환경 변수 관리 (중요!)

**보안을 위해 절대 `.env` 파일을 커밋하지 마세요!**

1. `.env.example` 파일을 복사하여 `.env` 파일 생성
2. 실제 API 키와 토큰으로 값 채우기
3. `.env` 파일은 `.gitignore`에 의해 자동으로 제외됨

**필요한 환경 변수:**
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `OPENAI_API_KEY` 또는 `GEMINI_API_KEY` - LLM API 키
- `CORS_ORIGIN` - 프론트엔드 URL (기본: http://localhost:5173)

## 라이선스

MIT