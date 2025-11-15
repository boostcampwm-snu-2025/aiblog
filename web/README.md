# Web - Frontend Application (2주차: Smart Blog UI)

Smart Blog의 프론트엔드 애플리케이션입니다. React와 TypeScript로 구축되었으며, Vite를 번들러로 사용합니다.  
2주차 미션에서는 GitHub 활동에 대한 **LLM 블로그 요약**을 생성하고, 이를 **Selected Commit / AI Summary** 영역에서 확인·저장할 수 있는 Smart Blog 레이아웃을 구현했습니다.

## 디렉토리 구조

```
web/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── index.html
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx                # React 앱 진입점
    ├── App.tsx                 # 메인 애플리케이션 컴포넌트 (Smart Blog 레이아웃)
    ├── api.ts                  # 백엔드 API 클라이언트 (요약 생성, 포스트 저장 포함)
    ├── api.types.ts            # API 결과 타입 정의 (Post 등)
    ├── types.ts                # Activity 타입 정의
    ├── styles.css              # 전역 CSS 스타일 (헤더, 2열 레이아웃, 카드 스타일)
    ├── assets/
    │   └── react.svg
    └── components/
        ├── RepoForm.tsx        # GitHub 저장소 검색 폼 (owner/repo + 기간)
        ├── ActivityList.tsx    # 활동 목록 + Generate Summary 버튼
        ├── BlogPreview.tsx     # AI 블로그 요약 미리보기
        ├── Loader.tsx          # 로딩 스피너
        └── ErrorBanner.tsx     # 에러 메시지 배너
```

## 주요 컴포넌트

### App.tsx

애플리케이션의 메인 컴포넌트입니다. 상단 `Smart Blog` 헤더와, 좌측 **Recent Commits**, 우측 **Selected Commit / AI Summary** 의 2열 레이아웃을 구성합니다.  
다음과 같은 상태를 관리합니다:

- `items`: GitHub 활동 목록
- `loading`: GitHub 목록 로딩 상태
- `error`: 목록 조회 에러 메시지
- `searched`: 검색 실행 여부
- `selected`: 선택된 커밋/PR
- `summary`: LLM이 생성한 블로그 마크다운
- `summaryLoadingId`: 요약 생성 중인 활동 ID
- `summaryError`: 요약 생성 에러 메시지
- `saving`: 포스트 저장 중 여부
- `saveMessage`: 저장 결과 메시지

좌측 카드에서 **Generate Summary** 버튼을 클릭하면 `/api/summarize`를 통해 AI 요약을 생성하고, 우측 패널에 출력합니다.  
요약이 생성된 상태에서는 **Save as Blog Post** 버튼으로 `/api/posts`에 저장할 수 있습니다.

### RepoForm.tsx

GitHub 저장소를 검색하는 폼 컴포넌트입니다.

- 하나의 입력창에 `owner/repo` 형식으로 저장소를 입력합니다. (예: `facebook/react`)
- 드롭다운으로 조회 기간(14일, 30일, 90일 등)을 선택합니다.
- 제출 시 `onSearch(owner, repo, sinceDays)` 콜백을 호출합니다.

### ActivityList.tsx

GitHub 활동 목록을 카드 형태로 표시하는 컴포넌트입니다. 각 카드에는 다음 정보가 포함됩니다:

- 타입 배지: `COMMIT` 또는 `PR`
- 제목 링크: 해당 GitHub 페이지로 이동
- 메타 정보: 날짜, 작성자, 브랜치명
- 오른쪽 버튼: **Generate Summary**

버튼 클릭 시 상위에서 전달받은 `onGenerate(activity)` 콜백을 호출하여 AI 요약을 트리거합니다.  
현재 선택된 커밋은 강조 테두리로 표시되고, 요약 생성 중일 때는 버튼 텍스트가 `요약 생성 중…` 으로 변경됩니다.

### BlogPreview.tsx

생성된 블로그 포스트를 마크다운 문자열 그대로 미리보기하는 간단한 컴포넌트입니다.  
현재는 `<pre>` 기반으로 표시하며, 필요 시 마크다운 렌더러로 확장할 수 있습니다.

### Loader.tsx

로딩 중일 때 표시되는 스피너 컴포넌트입니다.

### ErrorBanner.tsx

에러 발생 시 메시지를 표시하는 배너 컴포넌트입니다.

## API 클라이언트

`api.ts`는 백엔드 서버와 통신하는 함수들을 제공합니다:

```typescript
fetchRecent(owner: string, repo: string, sinceDays?: number)
summarizeActivities(items: Activity[], language?: 'ko' | 'en', tone?: 'blog' | 'concise')
createPost(title: string, markdown: string, tags?: string[])
```

- **`fetchRecent`**: GitHub 저장소의 최근 활동(커밋/PR) 목록을 조회합니다.
- **`summarizeActivities`**: 선택한 활동들을 서버 `/api/summarize` 엔드포인트에 전달하여 블로그 스타일의 마크다운을 생성합니다.
- **`createPost`**: 생성된 마크다운을 서버 `/api/posts`에 저장하여 블로그 포스트로 관리합니다.

기본 API 주소는 `http://localhost:8080` 이며, 필요 시 `VITE_API_BASE` 환경 변수로 변경할 수 있습니다.

## 타입 정의

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

서버의 타입 정의와 동일하게 유지해야 합니다.

## 설치 및 실행

의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

Vite 개발 서버가 http://localhost:5173 에서 실행됩니다. Hot Module Replacement(HMR)가 활성화되어 코드 변경 시 즉시 반영됩니다.

프로덕션 빌드:

```bash
npm run build
```

빌드된 파일은 dist 디렉토리에 생성됩니다.

빌드 미리보기:

```bash
npm run preview
```

## 기술 스택

- React 19.x: UI 라이브러리
- TypeScript 5.x: 타입 안전성
- Vite 7.x: 빌드 도구 및 개발 서버
- ESLint: 코드 품질 관리

## 스타일링

`styles.css`에 전역 스타일이 정의되어 있습니다.  
2주차 미션에서는 Smart Blog 디자인에 맞춰 다음과 같은 구조를 사용합니다.

- `.app-root`, `.app-header`, `.app-main`: 전체 레이아웃 및 상단 헤더 영역
- `.content-layout`: 좌측 Recent Commits / 우측 Selected Commit 의 2열 그리드
- `.item-card`, `.item-card--selected`: 커밋/PR 카드
- `.generate-btn`: Generate Summary 버튼
- `.selected-card`, `.preview`, `.save-btn`: 우측 선택 영역 및 AI Summary / 저장 버튼

반응형 레이아웃으로, 폭이 좁은 화면에서는 2열 그리드가 1열로 전환됩니다.

## 개발 참고사항

### 상태 관리

현재는 React의 기본 useState와 useEffect 훅을 사용하여 상태를 관리합니다. 복잡도가 증가하면 Context API나 상태 관리 라이브러리 도입을 고려할 수 있습니다.

### API 통신

fetch API를 직접 사용하고 있습니다. 에러 처리는 try-catch로 처리하며, 네트워크 에러나 서버 에러 시 사용자에게 메시지를 표시합니다.

### 브랜치 표시

브랜치 정보는 Activity 객체의 branch 필드로 전달됩니다. ActivityList 컴포넌트에서 브랜치가 있을 때만 표시합니다.

### ESLint 설정

eslint.config.js에 React 관련 린트 규칙이 설정되어 있습니다. 코드 작성 시 린트 경고를 확인하고 수정하는 것이 좋습니다.

## TypeScript 설정

프로젝트는 세 개의 TypeScript 설정 파일을 사용합니다:

- tsconfig.json: 기본 설정
- tsconfig.app.json: 애플리케이션 코드용
- tsconfig.node.json: Vite 설정 파일용

React 19와 TypeScript의 최신 기능을 활용합니다.
