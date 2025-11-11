# Web - Frontend Application

Smart Blog의 프론트엔드 애플리케이션입니다. React와 TypeScript로 구축되었으며, Vite를 번들러로 사용합니다.

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
    ├── App.tsx                 # 메인 애플리케이션 컴포넌트
    ├── api.ts                  # 백엔드 API 클라이언트
    ├── types.ts                # TypeScript 타입 정의
    ├── styles.css              # 전역 CSS 스타일
    ├── assets/
    │   └── react.svg
    └── components/
        ├── RepoForm.tsx        # GitHub 저장소 검색 폼
        ├── ActivityList.tsx    # 활동 목록 표시 및 선택
        ├── BlogPreview.tsx     # 블로그 포스트 미리보기
        ├── Loader.tsx          # 로딩 스피너
        └── ErrorBanner.tsx     # 에러 메시지 배너
```

## 주요 컴포넌트

### App.tsx

애플리케이션의 메인 컴포넌트입니다. 다음 상태를 관리합니다:

- items: GitHub 활동 목록
- loading: 로딩 상태
- error: 에러 메시지
- searched: 검색 실행 여부

검색을 실행하기 전에는 빈 화면을 보여주고, 검색 후 활동이 없을 때만 "활동이 없습니다" 메시지를 표시합니다.

### RepoForm.tsx

GitHub 저장소를 검색하는 폼 컴포넌트입니다. owner와 repo 이름을 입력받아 onSearch 콜백을 호출합니다.

### ActivityList.tsx

GitHub 활동 목록을 표시하는 컴포넌트입니다. 각 활동 항목에는 다음 정보가 포함됩니다:

- 체크박스: 다중 선택 지원
- 타입 배지: COMMIT 또는 PR
- 제목 링크: GitHub 페이지로 이동
- 메타 정보: 작성 시간, 작성자, 브랜치명

브랜치명은 브랜치 아이콘과 함께 표시됩니다.

### BlogPreview.tsx

생성된 블로그 포스트를 미리보기하는 컴포넌트입니다.

### Loader.tsx

로딩 중일 때 표시되는 스피너 컴포넌트입니다.

### ErrorBanner.tsx

에러 발생 시 메시지를 표시하는 배너 컴포넌트입니다.

## API 클라이언트

api.ts는 백엔드 서버와 통신하는 함수들을 제공합니다:

```typescript
fetchRecent(owner: string, repo: string, sinceDays: number)
```

GitHub 저장소의 최근 활동을 조회합니다. 기본 API 주소는 http://localhost:8080 이지만, 환경에 따라 변경할 수 있습니다.

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

styles.css에 전역 스타일이 정의되어 있습니다. 컴포넌트별 스타일은 className을 통해 적용됩니다.

주요 클래스:

- .container: 메인 컨테이너
- .list: 활동 목록 컨테이너
- .item: 개별 활동 항목
- .badge: 타입 배지 (commit/pr)
- .meta: 메타 정보 (시간, 작성자, 브랜치)
- .empty: 빈 상태 메시지
- .loader: 로딩 스피너

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
