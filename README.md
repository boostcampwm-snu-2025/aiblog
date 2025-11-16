# aiblog

## 1주차

### 백엔드 (FastAPI)

- [x] GitHub OAuth2 로그인 구현
- [x] 사용자 레포지토리 목록 조회 API 구현
- [x] 사용자 레포지토리 커밋 목록 조회 API 구현
- [x] 사용자 레포지토리 풀 리퀘스트 목록 조회 API 구현
- [x] Google Gemini를 활용한 커밋/PR 요약 API 구현

### 프론트엔드 (React)

#### 헤더

- [x] Github 탭, 로그인/로그아웃 버튼 구현

#### 레포지토리 목록 페이지

- [x] 레포지토리 카드 컴포넌트 구현
- [x] 레포지토리 카드에서 커밋/풀 리퀘스트 탭 전환 구현
- [x] 커밋 목록 컴포넌트 구현
- [x] 풀 리퀘스트 목록 컴포넌트 구현
- [x] 페이징 처리 구현 (커밋은 5개, 풀 리퀘스트는 1개씩)
- [x] 로딩 및 에러 처리 구현

#### 환경변수 설정

- [x] .env 파일을 통한 환경변수 설정 (VITE_API_BASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET 등)

## How to run

### 1. .env 파일 복사

```bash
cp .env.example .env
```

GITHUB_CLIENT_ID와 GITHUB_CLIENT_SECRET 값을 본인의 GitHub OAuth 앱 정보로 수정합니다.

Gemini 요약 기능을 사용하려면 [Google AI Studio](https://aistudio.google.com/)에서 발급한 `GEMINI_API_KEY`와 원하는 `GEMINI_MODEL` 값을 `.env`에 추가하세요. 기본 모델은 `gemini-1.5-flash`입니다.

### 2. uv 설치

macOS / Linux

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Windows

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. 가상환경 설정

```bash
uv sync
source ~/.venv/bin/activate
```

### 4-1. 백엔드 실행

```bash
uv sync
source ~/.venv/bin/activate
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### 4-2. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 4-3. 한번에 실행

```bash
sh run_all.sh
```
