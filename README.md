# AI Blog
프로젝트 구상 및 필요 기술 스택 정리

## 프로젝트 구상
나의 github repo, commit 등 정보를 custom page로 보여주기

## 필요 기술 스택
1. 백엔드 서버 구축
	- express로 백엔드 서버 구현
	- github api로 필요 정보 백엔드 서버에 가져오기
	- frontend 웹페이지와 통신할 단위 지정

2. 프론트엔드 구현
	- 메인 페이지에서는 repo 리스트+abstract 띄워주고, 해당 repo 클릭 시 상세 페이지로 이동
	- 상세 페이지에서는 commit log와 추가적인 설명 뜨도록 구현 (설명은 LLM으로 generate)

3. LLM API 연동

## 2주차 구현 목표
- [ ] repository별 상세 정보 페이지 추가 (PR/commit 기록 볼 수 있도록)
- [ ] PR/commit 기록에 블로그 생성 버튼 추가: 생성 버튼 클릭시 LLM 돌도록 구현