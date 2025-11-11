## 요구사항 분석

-   문제 정의: 개발자가 본인 프로젝트의 진행 과정(커밋, PR, 이슈)과 사용 기술 스택을 AI를 통해 자동으로 요약하고, 이를 쉽게 확인 및 관리할 수 있는 개인형 기술 블로그를 구현한다.

-   핵심 시나리오:

    1. 사용자가 개인 프로젝트의 GitHub 레포지토리 주소(owner/repo)를 입력하면, 해당 레포지토리의 최근 작업 기록(커밋, PR) 목록이 표시된다.
    2. 각 작업 기록을 클릭하면, AI가 해당 작업의 내용과 사용된 기술 스택을 자동으로 요약/정리한 내용을 볼 수 있다.
    3. GitHub Project의 이슈(Issue)를 진행 전/중/후 상태별로 시각화하고, 자신에게 할당된 이슈를 필터링할 수 있다.

-   평가 기준:
    1. (UI/UX) 사용자가 레포지토리 정보를 쉽게 입력하고, 커밋/이슈 목록을 직관적으로 탐색할 수 있는가?
    2. (AI 품질) 생성된 AI 요약이 원본 커밋/PR 내용을 충실히 반영하고, 기술 스택을 명확하게 정리해주는가?
    3. (아키텍처) Client / Express(Proxy) / External API 간의 3-Tier 아키텍처와 프록시 역할이 명확하게 구현되었는가?
    4. (성능) GitHub/Gemini API 요청 시 적절한 로딩 상태를 표시하고, 응답 시간이 과도하게 길지 않은가?

## 주차별 목표

-   1주차: 3-Tier (Client-Proxy-External) 아키텍처 구축. Express 프록시 서버를 통해 GitHub GraphQL API 데이터를 React Client에 렌더링.
-   2주차: LLM 연동. Client의 요청에 따라 Express 서버가 Gemini API를 호출, 비동기적으로 AI 요약 콘텐츠를 생성하여 Client에 제공.
-   3주차: 데이터 영속성(Persistence) 구현. AI가 생성한 블로그 콘텐츠를 LocalStorage에 저장하고, 사용자가 '저장된 글' 목록을 조회/관리할 수 있는 UI 구현.

## 개발 기능 정리

1. Repository 데이터 조회
    - 사용자가 내 GitHub 저장소 owner와 repo 이름을 입력했을 때 "가져오기" 버튼을 누르면 (로딩 스피너가 잠시 보인 후) 해당 repo의 커밋/PR 기록이 화면에 카드 형태로 표시된다. 만약 토큰이나 레포지토리 이름이 잘못되면, 사용자에게 에러 메시지를 보여준다.
2. AI 작업 요약 생성
    - 사용자가 조회된 커밋/PR 목록에서 특정 항목을 선택했을 때 "AI 요약하기" 버튼을 누르면 (로딩 스피너가 잠시 보인 후) 해당 작업의 상세 내용과 기술 스택이 AI에 의해 정리된 창(모달 또는 패널)이 나타난다.
3. 생성된 블로그 글 저장
    - 사용자가 AI가 생성한 요약 내용을 확인한 후 "블로그로 저장하기" 버튼을 누르면 해당 내용이 LocalStorage에 저장되어 '내 저장 글' 목록에 추가된다.
4. 저장된 글 조회 및 관리
    - 사용자가 '내 저장 글' 탭(페이지)으로 이동하면 이전에 저장했던 모든 블로그 글의 목록이 나타난다. 목록에서 특정 항목을 클릭하면 저장된 상세 내용을 다시 볼 수 있다.
5. 이슈 필터링 및 조회
    - 사용자가 '이슈' 탭을 선택했을 때 진행 상태(예: 진행 중) 또는 '내게 할당된 이슈' 필터를 클릭하면 해당 조건에 맞는 이슈 목록만 화면에 다시 표시된다.

## 기술 스택 정하기

-   Tech Stack:
    -   Frontend: React (with Vite), TypeScript
    -   Styling: TailwindCSS
    -   Backend: Express (Node.js)
    -   External APIs: GitHub (GraphQL), Google Gemini API
-   Architecture & Principles:
    -   (3-Tier Proxy) Client(React)는 오직 Express 서버와 통신합니다. 모든 외부 API(GitHub, Gemini) 호출 및 API 키 관리는 Express 서버가 전담합니다.
    -   (GitHub API) 데이터 효율성을 위해 GitHub API는 REST 대신 GraphQL을 사용한다.
    -   (State Management) 컴포넌트 상태는 5개 미만으로 유지합니다. 5개 이상 10개 미만은 useReducer (또는 useReduction)를 고려하며, 10개 이상일 경우 컴포넌트를 분리한다.
    -   (Storage) 생성된 블로그 콘텐츠는 1차적으로 LocalStorage를 사용해 클라이언트 측에 저장한다.
