3주차에 할 것. 

1. 생성된 글 저장/관리 (가장 중요!)

- 현재는 블로그를 생성하고 닫으면 사라짐
- localStorage 기반으로 저장해야 함

2. 저장된 글 목록/상세 보기

- 저장된 블로그 목록을 볼 수 있는 페이지 필요
- 각 블로그 상세 페이지 필요

3. 전역 상태 관리 도입

- Context API + useReducer 사용
- localStorage 동기화



구현해야 할 것.
 1. 전역 상태 관리 설정
    - BlogContext 생성 (Context API + useReducer)
    - 상태: { blogs: [], status: 'idle' | 'loading' | 'success' | 'error' }
    - 액션: SAVE_BLOG, DELETE_BLOG, LOAD_BLOGS 등
  2. localStorage 저장/불러오기
    - 블로그 생성 시 자동 저장
    - 앱 시작 시 localStorage에서 불러오기
    - 커스텀 훅 useLocalStorage 만들기
  3. 블로그 목록 페이지 추가
    - /blogs 라우트 생성
    - 저장된 블로그 카드 형식으로 표시
    - 검색/필터 기능 (선택)
  4. 블로그 상세 페이지 추가
    - /blogs/:id 라우트 생성
    - 수정/삭제 기능

리팩토링:
   1. 중복 로직 컴포넌트화
   2. 더 고려해봐야함.. 