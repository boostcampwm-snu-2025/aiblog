# aiblog

## 기술스택

- Common

  - Node.js
  - pnpm
  - TypeScript

- Server

  - Express
  - Octokit (GitHub API client)
  - @google/genai (AI integration)
  - Zod (validation)
  - biomejs (linter & formatter)

- Web

  - React
  - Vite (build tool)
  - shadcn/ui (ui library)
  - Tailwind CSS (styling)
  - TanStack Query (data fetching)
  - Tanstack Router (routing)
  - dayjs (date handling)
  - Zod (validation)
  - eslint (linter)
  - prettier (formatter)

## 화면 구성

1. 리포지토리 검색 화면 (`/`)

- 리포지토리 검색 입력창
- 여러 방법으로 리포지토리 검색 가능
  - /search/repositories 엔드포인트를 사용하여 리포지토리 검색
  - /users/{username}/repos 엔드포인트를 사용하여 특정 사용자의 리포지토리 검색
- 검색 결과 목록 표시
- 검색된 리포지토리 선택 시 경로 반영 (`/repos/{owner}/{repo}`)
  - 선택한 리포지토리의 기본 정보 표시
  - 브랜치와 풀 리퀘스트 선택 화면으로 이동하는 링크 제공

2. 브랜치 화면 (`/repos/{owner}/{repo}/branches`)

- 브랜치 선택 드롭다운
- 브랜치 선택 시 경로 반영 (`/repos/{owner}/{repo}/branches/{branch}`)
- 선택한 브랜치의 커밋 목록 표시

3. 풀 리퀘스트 화면 (`/repos/{owner}/{repo}/pull-requests`)

- 풀 리퀘스트 선택 드롭다운
- 풀 리퀘스트 선택 시 경로 반영 (`/repos/{owner}/{repo}/pull-requests/{pullRequest}`)
- 선택한 풀 리퀘스트의 커밋 목록 표시

4. 커밋 상세 정보 표시 (`/repos/{owner}/{repo}/commits/{ref}`)

- 선택한 커밋의 상세 정보 (메시지, 작성자, 날짜 등) 표시
- diff 뷰어를 사용하여 커밋 변경 사항 시각화
- Generate Summary 버튼을 통해 AI 요약 생성 기능 제공
