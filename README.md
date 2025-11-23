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

## 3주차 구현 목표
- [ ] 미구현 기능: LLM call loading 표시 기능 구현
- [ ] 생성된 블로그 저장 기능 구현
- [ ] 1,2주차 review 반영하여 코드 리팩토링

## 추후 구현 필요 사항
llm call 시 돌아가고 있다는 표시가 되도록 Blog 창에 loading 같은 것을 걸거나, 다시 버튼 클릭 되는 것을 block하도록 구현할 필요