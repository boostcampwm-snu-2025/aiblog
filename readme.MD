1) Frontend (React)
- 입력 Form 구성: owner, repo 입력 후 "불러오기" 버튼
- 버튼 클릭 시 /api/github/activities 서버 호출
- 응답으로 받은 활동 데이터 리스트 렌더링
- loading, error, no data 상태 표시

2) Backend (Express)
- 라우트 생성: GET /api/github/activities?owner=&repo=
- GitHub API 호출 (2개):
  - /repos/{owner}/{repo}/commits
  - /repos/{owner}/{repo}/pulls?state=all
- Commit 및 PR 데이터를 공통 형태(Activity)로 변환
- createdAt 기준 내림차순 정렬
- GitHub Token은 .env 로 관리 (프론트로 노출 금지)

3) GitHub API
- REST API 사용, 인증 필요
- 사용 Endpoints:
  - GET /repos/{owner}/{repo}/commits
  - GET /repos/{owner}/{repo}/pulls?state=all
- 요청 헤더:
  Authorization: Bearer <GITHUB_TOKEN>
  User-Agent: github-activity-blog
