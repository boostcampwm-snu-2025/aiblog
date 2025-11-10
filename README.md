# AI Blog - GitHub Activity to Blog Generator

GitHub 활동 데이터를 분석해 자동으로 개발 블로그를 생성하는 서비스입니다.

## 📋 프로젝트 개요

이 프로젝트는 GitHub API와 LLM을 연동하여 커밋과 PR 내용을 분석하고, 자동으로 블로그 글을 생성하는 웹 애플리케이션입니다.

### 주요 기능

- ✅ GitHub Repository 데이터 가져오기
- ✅ 커밋/PR 목록 탭 분리 표시
- ✅ 검색 및 정렬 기능
- ✅ GitHub 스타일 UI
- ✅ 반응형 디자인
- 🚧 LLM을 활용한 블로그 콘텐츠 자동 생성 (2주차)
- 🚧 생성된 글 저장 및 관리 (3주차)

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링 (GitHub 스타일 커스텀)
- **TanStack Query (React Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 전역 상태 관리
- **Axios** - HTTP 클라이언트

### Backend
- **Express.js** - Node.js 웹 프레임워크
- **Axios** - GitHub API 호출
- **dotenv** - 환경 변수 관리

## 📁 프로젝트 구조

```
aiblog/
├── client/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   │   ├── activity/  # 커밋/PR 관련 컴포넌트
│   │   │   ├── common/    # 공통 컴포넌트
│   │   │   ├── layout/    # 레이아웃 컴포넌트
│   │   │   └── repository/ # Repository 입력
│   │   ├── hooks/         # Custom Hooks (React Query)
│   │   ├── store/         # Zustand 스토어
│   │   ├── api/           # API 클라이언트
│   │   ├── utils/         # 유틸리티 함수
│   │   ├── App.jsx        # 메인 App 컴포넌트
│   │   └── main.jsx       # 진입점
│   └── package.json
│
├── server/                 # Express 백엔드
│   ├── src/
│   │   ├── routes/        # API 라우트
│   │   ├── services/      # GitHub API 서비스
│   │   └── index.js       # 서버 진입점
│   ├── .env.example       # 환경 변수 예제
│   └── package.json
│
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- GitHub Personal Access Token

### 설치 및 실행

1. **레포지토리 클론**
```bash
git clone https://github.com/boostcampwm-snu-2025/aiblog.git
cd aiblog
```

2. **서버 설정**
```bash
cd server
npm install

# .env 파일 생성
copy .env.example .env
# .env 파일을 열어 GITHUB_TOKEN을 설정하세요
```

3. **클라이언트 설정**
```bash
cd ../client
npm install
```

4. **서버 실행** (터미널 1)
```bash
cd server
npm run dev
```

5. **클라이언트 실행** (터미널 2)
```bash
cd client
npm run dev
```

6. **브라우저에서 열기**
```
http://localhost:5173
```

## 🔑 GitHub Token 설정

1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) 접속
2. "Generate new token (classic)" 클릭
3. 권한 선택:
   - `repo` (전체) - Private 레포 접근 시
   - `public_repo` - Public 레포만 접근 시
4. 생성된 토큰을 복사하여 `server/.env` 파일의 `GITHUB_TOKEN`에 설정

## 📊 상태 관리 전략

이 프로젝트는 3가지 상태 관리 도구를 적절히 활용합니다:

### 1. TanStack Query (React Query)
- **역할**: 서버 상태 관리
- **사용처**: GitHub API 데이터 페칭, 캐싱, 재시도
- **장점**: 자동 캐싱, 로딩/에러 상태 관리, 요청 중복 제거

### 2. Zustand
- **역할**: 클라이언트 전역 상태 관리
- **사용처**: UI 상태 (탭, 정렬, 검색, 필터)
- **장점**: 간단한 API, Provider 불필요, 가벼움

### 3. Context API (향후 확장)
- **역할**: 앱 레벨 설정
- **사용처**: 테마, 사용자 설정 등
- **장점**: React 내장, 전역 설정에 적합

## 🎨 디자인 시스템

GitHub의 Primer 디자인 시스템을 참고하여 다크 모드 중심의 UI를 구현했습니다.

### 주요 색상
- Canvas: `#0d1117` (배경)
- Accent: `#58a6ff` (강조)
- Success: `#3fb950` (성공)
- Danger: `#f85149` (오류)

## 📝 1주차 미션 완료 사항

- ✅ 프로젝트 구조 설계 및 환경 구성
- ✅ Express 서버 설정 및 GitHub API 연동
- ✅ React + Vite + Tailwind CSS 설정
- ✅ 상태 관리 라이브러리 설정 (TanStack Query, Zustand)
- ✅ Repository 입력 컴포넌트
- ✅ 커밋/PR 탭 UI
- ✅ 검색 및 정렬 기능
- ✅ 로딩 및 에러 처리 UI
- ✅ GitHub 스타일 디자인

## 🔜 다음 단계 (2주차)

- [ ] OpenAI API 연동
- [ ] 커밋/PR 데이터를 LLM에 전달
- [ ] 블로그 글 자동 생성
- [ ] 생성된 글 미리보기

## 📄 라이선스

MIT License

## 👥 개발자

부스트캠프 웹・모바일 12기