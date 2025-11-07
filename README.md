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

## 다음 단계 예정
- [] LLM(OpenAI 등) 연동으로 커밋/PR 내용 요약
- [] 요약 결과를 Blog Post 형식으로 자동 변환
- [] 로컬 저장소(localStorage or DB) 기반 My Posts 관리
- [] 요약 생성 및 저장 버튼 UI 추가