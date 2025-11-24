# 3주차 미션: LLM 연동 및 상태 관리 리팩토링

## 구현 완료 내용

### 1. 전역 상태 관리 (Context API + useReducer)
- **위치**: `client/src/contexts/BlogContext.jsx`
- **구현 사항**:
  - `useReducer`를 사용한 전역 상태 관리
  - localStorage와 자동 동기화
  - Action Types: `LOAD_POSTS`, `ADD_POST`, `DELETE_POST`, `SET_CURRENT_POST`, `SET_STATUS`, `SET_ERROR`, `CLEAR_ERROR`
  - State Shape:
    ```javascript
    {
      posts: [],          // 저장된 블로그 글 목록
      currentPost: null,  // 현재 보고 있는 글
      status: 'idle',     // 'idle' | 'loading' | 'success' | 'error'
      error: null
    }
    ```

### 2. 비동기 상태 패턴 (idle/loading/success/error)
- **위치**: `client/src/hooks/useAsync.js`
- **구현 사항**:
  - 비동기 함수를 래핑하여 상태 관리
  - 반환값: `{ execute, status, data, error, isLoading, isSuccess, isError, isIdle }`
  - UI에 로딩/에러 상태 반영 가능

### 3. 커스텀 훅 리팩토링
- **위치**: `client/src/hooks/useBlog.js`
- **구현 사항**:
  - TanStack Query 제거, Context 기반으로 전환
  - `useGenerateBlogFromCommit()`: 커밋에서 블로그 생성 및 자동 저장
  - `useGenerateBlogFromPR()`: PR에서 블로그 생성 및 자동 저장
  - `useBlogList()`: 저장된 블로그 목록 조회
  - `useCurrentBlog()`: 현재 선택된 블로그 관리

### 4. 저장된 글 목록/상세 UI
- **목록**: `client/src/components/blog/BlogList.jsx`
  - localStorage에 저장된 블로그 목록 표시
  - 삭제 기능
  - 클릭하여 상세보기
- **상세**: `client/src/components/blog/BlogViewer.jsx`
  - Context와 연동하여 상세 표시
  - 모달 형태로 제공

### 5. App 전체 구조 개선
- **위치**: `client/src/App.jsx`
- **구현 사항**:
  - `BlogProvider`로 전체 앱 감싸기
  - View 전환 기능 추가 (Activity ↔ Saved Blogs)
  - 현재 선택된 포스트 자동 표시

### 6. Server 리팩토링
- **위치**: `server/src/routes/blog.js`
- **구현 사항**:
  - 서버는 **생성만 담당**
  - 저장 로직 제거 (클라이언트에서 localStorage로 관리)
  - 응답 형식: `{ success, content, metadata }`

### 7. Activity 컴포넌트 통합
- **위치**:
  - `client/src/components/activity/CommitItem.jsx`
  - `client/src/components/activity/PullRequestItem.jsx`
- **구현 사항**:
  - TanStack Query → Context 기반 훅으로 전환
  - 블로그 생성 후 자동으로 localStorage에 저장
  - 생성된 블로그 즉시 표시

## 주요 개선 사항

### ✅ 완전한 클라이언트 기반 저장
- 서버는 생성만 담당
- 클라이언트에서 localStorage로 저장/관리
- 오프라인에서도 저장된 글 조회 가능

### ✅ 전역 상태 관리 도입
- Context API + useReducer
- Props drilling 제거
- 일관된 상태 관리

### ✅ 비동기 상태 패턴
- idle/loading/success/error 명확히 구분
- UI에 로딩/에러 상태 자동 반영

### ✅ 중복 로직 커스텀 훅 분리
- `useAsync`: 비동기 로직 재사용
- `useBlog`: 블로그 관련 모든 로직 통합

## 사용 방법

### 1. 블로그 생성
1. Repository 입력
2. Commits 또는 Pull Requests 탭 선택
3. 원하는 항목에서 "블로그 생성" 버튼 클릭
4. 생성된 블로그 자동으로 localStorage에 저장 및 표시

### 2. 저장된 블로그 보기
1. 상단 "저장된 블로그" 버튼 클릭
2. 저장된 글 목록에서 원하는 글 클릭
3. 모달로 상세 내용 표시

### 3. 블로그 삭제
- 목록에서 휴지통 아이콘 클릭
- 확인 후 삭제

## 기술 스택
- React Context API + useReducer
- localStorage API
- Custom Hooks Pattern
- Async/Await Pattern
- Markdown Rendering (react-markdown)
