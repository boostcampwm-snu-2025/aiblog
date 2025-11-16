# Smart Blog – 1주차 구현 현황 체크리스트
## 프로젝트 환경 세팅
- [x] Express (Backend) 초기화 및 서버 구성
- [x] React (Vite + TypeScript) 프론트엔드 환경 설정
- [x] CORS, dotenv, axios 등 공통 유틸 설치 및 설정
- [x] Tailwind CSS v4 통합 및 스타일 기본 세팅

## Backend 
- [x] /api/github/commits — GitHub REST API로 커밋 목록 조회
- [x] /api/github/prs — GitHub REST API로 PR 목록 조회
- [x] /api/github/repos — 로그인 계정의 저장소 목록 조회
- [x] /api/pr-detail/${number} — 해당하는 PR의 설명 조회
- [x] .env 기반 Personal Access Token 보안 관리

## Frontend 구조
- [x] feature 단위 구조 (/features/github, /features/posts, /shared)
- [x] custom hook (useFetch) 로 API 요청·로딩·에러 관리
- [x] 공통 UI 컴포넌트 (Loader) 분리
- [x] Router 기반 페이지 분리 (GitHub, My Posts)
- [x] 상단 공통 Header + 브라우저 타이틀 연동

## GitHub 페이지 기능
- [x] Owner / Repo 입력 후 커밋 및 PR 목록 조회
- [x] 데이터 로딩 시 로딩 UI 표시
- [x] Commits / PRs 탭 전환
- [x] 내 저장소 목록 불러오기 (API 연동)
- [x] 저장소 클릭 시 자동 입력 및 데이터 fetch
- [x] “직접 입력” 클릭 시 input 초기화 처리
- [x] PR 상세 보기 모달 (가장 처음 게시글 마크다운 문서)
- [x] 리스트 페이지네이션 (10개 + 더보기 버튼)

# Smart Blog – 2주차 구현 현황 체크리스트 (LLM 연동)

## LLM API 연동 (Gemini 기반)
- [x] Google AI Studio API Key 발급 및 .env 적용
- [x] Backend에 Gemini SDK(`@google/genai`) 설정
- [x] LLM 요청용 service 계층 (`createBlogPost`) 구성
- [x] 요약 생성 라우트 (`POST /api/llm/generate`) 구현
- [x] 프론트엔드 SummaryButton → LLM 호출 연결

## 커밋/PR 요약 생성 기능

### Commit 기반 요약
- [x] `/api/github/commit-detail` 라우트 구현
- [x] commit-detail API에서 diff(patch) 포함 상세 데이터 수집
- [x] 프론트에서 commit SHA 기반으로 상세 diff fetch
- [x] diff·파일 목록·본문 등을 조합해 LLM 입력 prompt 구성
- [x] SummaryButton으로 diff 포함 commit 요약 생성

### Pull Request 기반 요약
- [x] PR 제목, 본문(body) 기반 content 생성
- [x] SummaryButton에서 LLM 호출 및 요약 전달
- [x] 요약 결과 SummaryPanel에 표시

## Frontend LLM 연동 UI
- [x] SummaryButton 컴포넌트 개선 (commit/PR별 content 동적 생성)
- [x] SummaryPanel 구성 (요약 결과 렌더링)
- [x] commit/PR 리스트에서 SummaryButton 정렬 및 UI 조정
- [x] 요약 결과 상태 저장 및 렌더링 처리

## Blog Post 형태로 자동 변환 (LLM 활용)
- [x] LLM 프롬프트 내 “블로그 형식(h2 섹션 포함)” 구조화 옵션 적용
- [x] commit/PR 변경사항 기반의 개발 블로그 텍스트 자동 생성
- [x] diff 기반으로 “무엇을 변경했는지/왜 했는지” 설명 포함
- [ ] 생성된 글을 My Posts로 저장하는 기능 (localStorage 또는 DB)
- [ ] 저장된 글 리스트 렌더링
- [ ] 저장된 글 상세 페이지 구현

## 기술 문맥 강화
- [x] commit 메시지 + body + 파일 변경 목록 + diff 기반 요약 구조 확립
- [ ] PR도 diff 기반 요약 지원(optional)
- [ ] 여러 commit을 묶어 "주간 개발 리포트" 자동 생성(optional)