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