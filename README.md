# ai blog 1주차
## 1. 환경 설정 (Project Setup)
* Client: React 프로젝트 생성
* Server: aiblog-server Express 프로젝트 생성
* Server: express, cors, dotenv 라이브러리 설치
* Server: .gitignore 파일에 .env, node_modules 추가
* Client/Server: React(Client)에서 Express(Server)의 테스트 API(/api/test)를 호출하여 CORS 포함 연결 확인

## 2. Express 서버 (API 프록시)
* Token: .env 파일 생성 및 GITHUB_TOKEN 환경 변수 설정
* Endpoint: GET /api/github/data 엔드포인트 생성
* Query Parsing: Client에서 보낸 repoName (owner/repo 형태) 및 filterType (all, commits, prs) 쿼리 파라미터 파싱
* GraphQL Logic: filterType 값에 따라 분기 처리
* all: 커밋 및 PR을 함께 가져오는 GraphQL 쿼리 작성
* commits: 커밋만 가져오는 GraphQL 쿼리 작성
* prs: PR만 가져오는 GraphQL 쿼리 작성
* Fetch Logic: fetch API와 Authorization: Bearer ${process.env.GITHUB_TOKEN} 헤더를 사용해 GitHub API (GraphQL) 호출
* Response: GitHub로부터 받은 JSON 데이터를 Client에 그대로 반환
* Error Handling: GitHub API 요청 실패 시 에러를 탐지하여 Client에 에러 응답 반환

## 3. React 클라이언트 (UI 구성)
* Layout: 2단 레이아웃(좌: 목록, 우: 상세) UI 골격 완성
* Header: "Smart Blog" 헤더 및 "Saved Posts", "Settings" 배치
* Input Area: "Repository" input 1개 배치
* Filter Area: "모두 / 커밋 / PR" 버튼 그룹 배치
* Button: "Fetch" (불러오기) 버튼 배치
* Left Panel: "Recent Commits" (최근 작업) 영역 타이틀
* Left Panel: "전체 선택" checkbox UI 배치
* Right Panel: "Selected Commit" (선택된 작업) 영역 타이틀
* Right Panel: "Notes for AI" (AI 요약 노트) textarea UI 배치

## 4. React 클라이언트 (상태 관리)
* Input State: repoName (저장소 입력값)
* Filter State: filterType (라디오 버튼 선택값, 기본값 'all')
* Fetch State: data (서버에서 받은 커밋/PR 목록)
* Fetch State: isLoading (로딩 상태)
* Fetch State: error (에러 메시지)
* Interaction State: checkedCommits (선택된 커밋/PR 목록, Set 또는 객체)
* Interaction State: activeCommit (사용자가 클릭하여 상세 보기 중인 항목)
* Interaction State: commitNotes (사용자가 작성한 커밋별 AI 노트, { [id]: "note" } 형태의 객체)

## 5. React 클라이언트 (기능 구현 및 연동)
* Event: "Fetch" 버튼 클릭 시 fetchData 함수 호출
* Data Fetching: fetchData 함수 내에서 isLoading을 true로 설정하고 Express 서버(GET /api/github/data?repoName=...&filterType=...)에 API 요청
* Data Fetching: 요청 완료 시 isLoading을 false로 설정하고, 성공 시 data에, 실패 시 error에 값 저장
* Conditional Rendering:
  * isLoading이 true일 때: 로딩 스피너 표시
  * error가 있을 때: 에러 메시지 표시
  * data가 있을 때: "최근 작업" 목록(data.map(...)) 렌더링
* List Rendering (Left Panel):
  * 각 항목에 checkbox (↔ checkedCommits 상태 연동)
  * 각 항목에 커밋/PR 제목, 작성자, 날짜 표시
  * 각 항목에 GitHub 원본으로 연결되는 <a> 태그 (외부 링크) 추가
  * 항목 클릭 시 activeCommit 상태를 해당 항목으로 변경
* Select All: "전체 선택" 체크박스 클릭 시 checkedCommits 상태를 전체 선택/해제
* Detail View (Right Panel):
  * activeCommit이 있으면 해당 항목의 상세 정보 표시
  * "Notes for AI" textarea의 value를 commitNotes[activeCommit.id]와 연동
  * textarea에 타이핑 시 onChange 이벤트를 받아 setCommitNotes로 해당 항목의 노트 업데이트

# ai blog 2주차

1. 서버 (Express) 환경 설정

* LLM API 키 발급: (예: Google AI Studio에서 Gemini API 키 발급)
* API 키 보안: aiblog-server/.env 파일에 GEMINI_API_KEY=...와 같이 발급받은 키를 추가합니다. (.gitignore에 .env가 포함되어 있는지 재확인)
* SDK 설치: aiblog-server 폴더 터미널에서 npm install @google/generative-ai를 실행하여 LLM 라이브러리를 설치합니다.

2.서버 (Express) 엔드포인트 구현

* 엔드포인트 생성: aiblog-server/index.js에 POST /api/llm/generate 엔드포인트를 새로 추가합니다.
* 데이터 수신: req.body에서 클라이언트가 보낸 selectedItems (커밋/PR 목록)와 notes (사용자 노트 객체)를 받습니다. (express.json() 미들웨어가 이미 설정되어 있어야 함)
* 프롬프트 엔지니어링: 전달받은 데이터를 바탕으로 LLM에게 보낼 프롬프트 텍스트를 생성하는 헬퍼 함수(예: createPrompt)를 작성합니다.
    * (예: "너는 전문 개발 블로거야. 다음 커밋 목록과 노트를 바탕으로 주간 회고록 스타일의 블로그 글을 작성해줘...")
* LLM 연동: index.js에서 Gemini 클라이언트를 초기화하고, 생성된 프롬프트로 generateContent 함수를 호출합니다.
* 응답 반환: try...catch문을 사용하여 LLM API 호출을 감싸고, 성공 시 생성된 텍스트를 res.json()으로 클라이언트에 반환합니다.
* 에러 핸들링: LLM API 호출 실패 시(예: API 키 오류, 과도한 요청 등) 500 에러와 메시지를 클라이언트에 반환합니다.

3.클라이언트 (React) 상태 관리

* Context 수정: aiblog-client/src/contexts/MainPageContext.jsx에 새로운 상태(State)들을 추가합니다.
    * isGenerating (boolean, 기본값 false): 'Generate' 버튼 로딩 스피너 제어용
    * generatedContent (string 또는 null, 기본값 null): 서버에서 받은 블로그 글 저장용
    * generationError (string 또는 null, 기본값 null): LLM API 에러 메시지 저장용
* 함수 구현: MainPageContext.jsx에 handleGenerateBlog 함수를 새로 구현합니다.
    * isGenerating(true), generatedContent(null), generationError(null)로 상태 초기화
    * useGitHubDataList 훅에서 가져온 items와 checkedCommits Set을 비교하여, 선택된 항목(item)의 전체 데이터 배열을 만듭니다.
    * commitNotes 상태도 함께 가져옵니다.
    * POST 방식으로 http://localhost:4000/api/llm/generate에 위 데이터(선택 항목 배열, 노트 객체)를 body에 담아 fetch 요청을 보냅니다.
    * (성공 시) 응답받은 data.text를 setGeneratedContent에 저장합니다.
    * (실패 시) 응답받은 error.message를 setGenerationError에 저장합니다.
    * finally 블록에서 isGenerating(false)를 실행합니다.

4.클라이언트 (React) UI 연동

* 버튼 연동: aiblog-client/src/components/GenerateButton.jsx를 수정합니다.
    * useMainPageContext에서 handleGenerateBlog 함수와 isGenerating 상태를 가져옵니다.
    * Button의 onClick 이벤트에 handleGenerateBlog 함수를 연결합니다.
    * isGenerating이 true일 때, 버튼 텍스트를 로딩 스피너(<CircularProgress size={24} />)로 변경합니다.
* 결과 표시 UI (신규): (스펙의 "자유롭게 구성" 항목)
    * src/components/ 폴더에 BlogResultModal.jsx 컴포넌트를 새로 생성합니다.
    * MUI의 <Modal> 또는 <Dialog> 컴포넌트를 사용합니다.
    * useMainPageContext에서 generatedContent와 setGeneratedContent를 가져옵니다.
    * open 속성은 !!generatedContent (즉, generatedContent가 있으면 true)와 연결합니다.
    * onClose 핸들러는 () => setGeneratedContent(null) (모달 닫기)와 연결합니다.
    * 모달 내부에 generatedContent에 담긴 블로그 글 텍스트를 <Typography> 등으로 렌더링합니다. (줄바꿈(\n)이 잘 표시되도록 whiteSpace: 'pre-wrap' 스타일 적용)
* 모달 적용: aiblog-client/src/pages/MainPage.jsx 파일의 MainPageContent 반환(return) 부분에 <BlogResultModal /> 컴포넌트를 추가합니다.
