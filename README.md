Smart Blog Maker
GitHub 저장소의 커밋/PR 이력을 AI로 요약하여 기술 블로그 초안을 생성해주는 프로젝트입니다.

# 🖥️ 주요 기능 데모
![데모 파일](./assets/demo.png)

# ✨ 주요 기능
GitHub 데이터 연동: GitHub 저장소 주소(URL 또는 owner/repo)를 입력받아 최근 커밋과 Pull Request 목록을 조회합니다.

보안 프록시 서버: Express 서버를 프록시로 사용하여 GitHub API 토큰을 서버에만 안전하게 보관하고 클라이언트의 요청을 중계합니다.

로딩 및 에러 처리: 데이터 조회 중에는 로딩 스피너를, 문제 발생 시에는 에러 메시지를 사용자에게 표시합니다.

(구현 예정) AI 요약: LLM (OpenAI 등) API를 연동하여 각 커밋/PR의 내용을 요약합니다.

(구현 예정) 로컬 저장: 생성된 블로그 글을 브라우저의 localStorage에 저장하고 관리합니다.

# 🛠️ 사용 기술 및 아키텍처
이 프로젝트는 다음과 같은 모노레포(Monorepo) 스타일의 구조로 구성되어 있습니다.

client/: React.js (Vite) + Tailwind CSS

server/: Node.js + Express

## 💻 Client (React)
Framework: React.js

Bundler: Vite

Styling: Tailwind CSS

Data Fetching: fetch API

## 📡 Server (Express)
Framework: Express.js

Runtime: Node.js

Middleware:

cors: 클라이언트(React)의 API 요청 허용

dotenv: API 토큰 등 환경 변수 관리

역할:

GitHub API Proxy: 클라이언트 대신 GitHub API를 호출합니다. (API 토큰 보안)

(예정) LLM API Gateway: LLM API 키를 관리하고 요약 요청을 처리합니다.

# 🚀 프로젝트 실행 방법
이 프로젝트를 로컬 환경에서 실행하려면 2개의 터미널이 필요합니다.

1. 프로젝트 클론
Bash

git clone https://(여러분의_저장소_주소).git
cd (프로젝트_폴더명)
2. (터미널 1) 📡 서버 실행
server 폴더는 API 요청을 중계하고 GitHub 토큰을 관리합니다.

Bash

1. server 디렉토리로 이동
cd server

2. 의존성 패키지 설치
npm install

3. .env 파일 생성 및 설정
    server 폴더 안에 .env 파일을 만들고 GITHUB_TOKEN을 입력합니다.
    (Node.js 18 미만인 경우) npm install node-fetch
server/.env 파일 예시:

GITHUB_TOKEN=ghp_... (발급받은 GitHub 토큰)
Bash

4. 서버 실행
node server.js

✅ http://localhost:3001 에서 서버 실행 확인
3. (터미널 2) 💻 클라이언트 실행
client 폴더는 사용자가 보는 React 앱입니다.

Bash

(새 터미널을 열고)
 1. client 디렉토리로 이동
cd client

 2. 의존성 패키지 설치
npm install

 3. React 개발 서버 실행
npm run dev
4. 브라우저 접속
브라우저에서 http://localhost:5173 (Vite가 알려주는 주소)으로 접속합니다.

## 📝 추후 구현 계획 (TBD)
[ ] LLM API 연동하여 "요약 생성" 버튼 기능 활성화

[ ] 커밋/PR 선택 기능

[ ] 요약된 내용을 편집하고 localStorage에 저장하는 기능

[ ] 저장된 블로그 목록 및 상세 보기 페이지 구현
