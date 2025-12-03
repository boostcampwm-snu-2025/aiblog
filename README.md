# aiblog

### 공통

- [x] docker compose로 백엔드, 프론트엔드, postgresql을 실행할 수 있도록 설정

### 백엔드 (FastAPI)

- [x] GitHub OAuth2 로그인 구현
- [x] 사용자 레포지토리 목록 조회 API 구현
- [x] 사용자 레포지토리 커밋 목록 조회 API 구현
- [x] 사용자 레포지토리 풀 리퀘스트 목록 조회 API 구현
- [x] Google Gemini를 활용한 커밋/PR 요약 API 구현
- [x] db 연결
- [x] blog post CRUD API 구현


### 프론트엔드 (React)

#### 공통

- [x] 로딩 컴포넌트 구현
- [x] 에러 컴포넌트 구현
- [x] tanstack query를 이용하여 데이터 로딩, 수정

#### 헤더

- [x] Github 탭, 로그인/로그아웃 버튼 구현

#### 레포지토리 목록 페이지

- [x] 레포지토리 카드 컴포넌트 구현
- [x] 레포지토리 카드에서 커밋/풀 리퀘스트 탭 전환 구현
- [x] 커밋 목록 컴포넌트 구현
- [x] 풀 리퀘스트 목록 컴포넌트 구현
- [x] 페이징 처리 구현 (커밋은 5개, 풀 리퀘스트는 1개씩)
- [x] 로딩 및 에러 처리 구현

#### 커밋/풀 리퀘스트 요약 페이지

- [x] 선택된 커밋/풀 리퀘스트 상세 정보 표시 구현
- [x] Gemini 요약 요청 및 결과 표시 구현

#### blog post 페이지

- [x] post 카드 컴포넌트 구현
- [x] post 카드에서 편집/삭제 기능 구현

#### 환경변수 설정

- [x] .env 파일을 통한 환경변수 설정 (VITE_API_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET 등)

## How to run

### 1. .env 파일 복사

```bash
cp .env.example .env
```

GITHUB_CLIENT_ID와 GITHUB_CLIENT_SECRET 값을 본인의 GitHub OAuth 앱 정보로 수정합니다.

[Google AI Studio](https://aistudio.google.com/)에서 발급한 `GEMINI_API_KEY`와 원하는 `GEMINI_MODEL` 값을 `.env`에 추가합니다. 기본 모델은 `gemini-2.5-flash`입니다.

### 2. docker compose로 실행

```bash
docker compose up -d
```