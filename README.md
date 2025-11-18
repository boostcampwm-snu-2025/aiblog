# aiblog

전기정보공학부 김희원 스마트블로그 프로젝트

## Plan

### 1주차

- frontend: vite, backend: express 개발 환경 세팅하기
- frontend/backend directory structure 확립
- Github에서 PR / recent commit 가져오기 (backend)
  - repo list 가져오는 API 생성 (public repo만 가져오기)
  - 선택된 repo에 대해, 그 repo의 commit들 가져오기
- 가져온 PR / recent commit를 보여주기 (frontend)

  - 공통 Header: `Header.tsx`
    - Github 탭: 1주차 용 (내 깃헙의 repo/commit/PR 정보를 보여준다)
    - Posts 탭: 2주차 & 3주차 용 (LLM이 생성한 Blog posts)
    - About 탭: 내 프로필 (2주차 쯤 LLM으로 내용을 생성하여 만들 예정)
  - `.env`: 환경 설정. 내 github token 저장되어 있음 (`.env.example` 참고)
  - `RepoCard.tsx`: card for each public repo
    - 각 `RepoCard` 의 `Commits` 버튼 클릭 시 그 repo의 recent commit 30개 가져와서 보여주도록 (페이지 당 5개씩): `CommitList.tsx`
    - 각 `RepoCard` 의 `PRs` 버튼 클릭 시 그 repo의 내 PR 30개 가져와서 보여주도록 (페이지 당 1개씩): `PRList.tsx`
  - `RepoGrid.tsx`: maps `RepoCard`s and shows all repos

#### 완료 작업 사진

- `Github` tab 클릭 시의 메인 페이지:

![GithubMainPage](./assets/1st_week/GithubMainPage.png)

- `Commits` button 클릭 시:

![CommitList](./assets/1st_week/CommitList.png)

- `PRs` button 클릭 시:

![PRList](./assets/1st_week/PRList.png)

### 2주차

- 1주차 PR 리뷰 반영하기(code convention 등)
- OpenAI API 연동 (Backend의 `.env`에 OpenAI API key 저장됨)
- Blog contents (post) 자동 생성하도록 OpenAI API 사용
  - Posts 탭:
    - `PostForm.tsx`
      - 나의 Repo 목록 불러오고, 선택된 repo에 해당하는 commit과 PR 목록을 불러온 후
      - commit은 Checkbox (여러 개 선택 가능), PR은 Select box(한 개만 선택 가능)로 구현
      - PR은 선택된 branch와 무관하게 모두 불러온다 (개수가 상대적으로 적으므로)
    - `PostResult.tsx`
    - `PostsPage.tsx`
- About 글 자동 생성하도록 OpenAI API 사용
  - About 탭:
    - `AboutCard.tsx`
    - `AboutPage.tsx`
- Posts, About에 공통으로 사용되는 `Lang`, `Tone` type 하나로 통일: types `PromptLang`, `PromptTone`
- `Lang`, `Tone` selectbox UI 컴포넌트화 (재사용): `LanguageSelectBox.tsx`, `ToneSelectBox.tsx`
- OpenAI API prompt 문서화

#### 완료 작업 사진

- `Posts` tab 클릭 시의 메인 페이지:

![PostsPage](./assets/2nd_week/PostsPage.png)

- `Posts` tab에서 글 생성:

![PostsPageGenerated](./assets/2nd_week/PostsPageGenerated.png)

- `About` tab 클릭 시의 메인 페이지:

![AboutPage](./assets/2nd_week/AboutPage.png)

- `About` tab에서 소개글 생성:

![AboutPageGenerated](./assets/2nd_week/AboutPageGenerated.png)

### 3주차

- 생성된 글 (포스트) localstorage에 저장 및 불러오기 기능: `postStorage.ts`에 구현
  - 포스트는 개수 제한 없이 모두 localstorage에 저장
- 생성된 소개글 localstorage에 저장 및 불러오기 기능: `aboutStorage.ts`에 구현
  - bio는 가장 최근에 생성한 1개만 localstorage에 저장
- 해당하는 UI 생성하기: `PostsPage.tsx`, `AboutPage.tsx` 수정

#### 완료 작업 사진

- 저장된 post들:

![SavedPosts](./assets/3rd_week/SavedPosts.png)

- 저장된 bio:

![SavedBio](./assets/3rd_week/SavedBio.png)

## How to run this project

### Vite Frontend

First set up the `.env` file at frontend root directory `aiblog-fe/`:

```bash
# check .env.example
cp .env.example .env
```

Now run the project:

```bash
# move to the frontend project directory
cd aiblog-fe

# install dependencies if needed
npm install

# run this project
npm run dev
```

This project will open at `http://localhost:5173`

### Express Backend

First set up the `.env` file at backend root directory `aiblog-be/`:

```bash
# check .env.example
cp .env.example .env
```

```bash
# move to the backend project directory
cd aiblog-be

# install dependecies if needed
npm install

# run this project
npm run dev
```

This project will open at `http://localhost:3000`

### Via Script

Or start this project using `start-all.sh`

```bash
# at root directory, run
sh start-all.sh
```

## Developing Branch

- Week1: `main` branch

- Week2: `week2` branch

- Week3: `week3` branch

## Directory Structure

### Frontend

- `src/`
  - `constants/`
  - `pages/`
  - `styles/`
  - `types/`
  - `ui/`
  - `utils/`
  - `main.tsx`

### Backend

- `routes/`
- `controllers/`
- `services/`
- `repositories/`
- `models/`
- `utils/`
- `data/`

## API Endpoints

### Test API

Test API to check if the server is running.

```plaintext
GET /test/version
```

### Github Data API

API to fetch data from my Github.

#### My Repos

API to fetch my public repo data from my Github.

```plaintext
GET /github-data/my-repos
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

#### Repo Branches

API to fetch branch data from a specific Github repository.

```plaintext
GET /github-data/branches
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

- Query Parameters:
  - `repo` (string): `kimheonningg/REPO_NAME`
  - `per_page` (number, number of branches to fetch, optional): `100`
  - `page` (number, page number to fetch, optional): `1`

#### Recent Commits

API to fetch recent commit data from a specific Github repository.

```plaintext
GET /github-data/recent-commits
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

- Query Parameters:
  - `repo` (string): `kimheonningg/REPO_NAME`
  - `sha` (string, branch name or commit SHA for filtering, optional): `main`
  - `since` (string (ISO 8601), optional): `2025-11-01T00:00:00Z`
  - `until` (string (ISO 8601), optional): `2025-11-02T00:00:00Z`
  - `per_page` (number, number of commits to fetch, optional): `20`
  - `page` (number, page number to fetch, optional): `1`

#### My Pull Requests

API to fetch my pull request data from a specific Github repository.

```plaintext
GET /github-data/my-pull-requests
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

- Query Parameters:
  - `repo` (string): `boostcampwm-snu-2025/REPO_NAME`
  - `state` (string, PR filter by PR state, optional): `open` / `closed` / `all`
  - `per_page` (number, number of PRs to fetch, optional): `20`
  - `page` (number, page number to fetch, optional): `1`

### 'Posts' Page API

API to generate the 'Posts' page content (post) using my Github data and OpenAI API.

```plaintext
GET /post/generate
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

- Query Parameters:
  - `repo` (string, `owner/name`): `kimheonningg/aiblog`
  - `commits` (string[], optional)
  - `prs` (number[], optional)
  - `lang` (string, optional): `kr` / `en`
  - `tone` (string, optional): `concise` / `friendly` / `formal`

Either `commits` or `prs` must be provided. (At least one is required)

### 'About' Page API

API to generate the 'About' page content using my Github data and OpenAI API.

```plaintext
GET /about/generate
```

- Headers:

```plaintext
Authorization: Bearer ghp_YOUR_GITHUB_TOKEN
Content-Type: application/json
```

- Query Parameters:
  - `github` (string, github link): `https://github.com/kimheonningg`
  - `lang` (string, optional): `kr` / `en`
  - `tone` (string, optional): `concise` / `friendly` / `formal`
