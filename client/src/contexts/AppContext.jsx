import { createContext, useContext, useReducer, useEffect } from 'react';
import { githubApi, blogApi } from '../apis/api';

// ==================== Context 생성 ====================
// Context를 만들어서 전역 상태를 공유할 수 있게 함
const AppContext = createContext(null);

// ==================== localStorage 키 ====================
const STORAGE_KEY = 'github_repo_cache';

// ==================== Reducer 액션 타입 ====================
// 상태 변경을 위한 액션들을 정의
const ACTIONS = {
  // GitHub 관련
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ACTIVITIES: 'SET_ACTIVITIES',
  SET_REPO_INFO: 'SET_REPO_INFO',

  // 블로그 관련
  SET_SELECTED_ACTIVITY: 'SET_SELECTED_ACTIVITY',
  SET_GENERATED_BLOG: 'SET_GENERATED_BLOG',
  SET_IS_GENERATING: 'SET_IS_GENERATING',
};

// ==================== 초기 상태 ====================
const initialState = {
  // GitHub 활동 데이터
  activities: [],
  repoInfo: null,
  isLoading: false,
  error: '',

  // 블로그 관련
  selectedActivity: null,
  generatedBlog: null,
  isGenerating: false,
};

// ==================== Reducer 함수 ====================
// 상태 변경 로직을 한 곳에서 관리
// switch문으로 액션 타입에 따라 상태를 업데이트
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_ACTIVITIES:
      return { ...state, activities: action.payload };

    case ACTIONS.SET_REPO_INFO:
      return { ...state, repoInfo: action.payload };

    case ACTIONS.SET_SELECTED_ACTIVITY:
      return {
        ...state,
        selectedActivity: action.payload,
        generatedBlog: null  // 새로운 활동 선택 시 블로그 초기화
      };

    case ACTIONS.SET_GENERATED_BLOG:
      return { ...state, generatedBlog: action.payload };

    case ACTIONS.SET_IS_GENERATING:
      return { ...state, isGenerating: action.payload };

    default:
      return state;
  }
}

// ==================== Provider 컴포넌트 ====================
// 전역 상태를 제공하고 관리하는 컴포넌트
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ========== 초기화: localStorage에서 데이터 불러오기 ==========
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const { activities, repoInfo } = JSON.parse(cached);
        dispatch({ type: ACTIONS.SET_ACTIVITIES, payload: activities });
        dispatch({ type: ACTIONS.SET_REPO_INFO, payload: repoInfo });
      } catch (err) {
        console.error('Failed to load cached repo data:', err);
      }
    }
  }, []);

  // ========== GitHub 활동 데이터 가져오기 ==========
  const fetchGitHubActivity = async ({ owner, repo }) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: '' });
    dispatch({ type: ACTIONS.SET_ACTIVITIES, payload: [] });

    try {
      const data = await githubApi.getActivity(owner, repo);
      const newRepoInfo = { owner, repo };

      // 상태 업데이트
      dispatch({ type: ACTIONS.SET_ACTIVITIES, payload: data });
      dispatch({ type: ACTIONS.SET_REPO_INFO, payload: newRepoInfo });

      // localStorage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activities: data,
        repoInfo: newRepoInfo
      }));

    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: err.response?.data?.message || '데이터를 가져오는 중 오류가 발생했습니다.'
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // ========== 활동 선택 ==========
  const selectActivity = (activity) => {
    dispatch({ type: ACTIONS.SET_SELECTED_ACTIVITY, payload: activity });
  };

  // ========== AI 블로그 생성 ==========
  const generateBlog = async (activity) => {
    dispatch({ type: ACTIONS.SET_IS_GENERATING, payload: true });

    try {
      const blog = await blogApi.generate(activity);
      dispatch({ type: ACTIONS.SET_GENERATED_BLOG, payload: blog });
    } catch (err) {
      console.error('Error generating blog:', err);
      alert('블로그 생성 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      dispatch({ type: ACTIONS.SET_IS_GENERATING, payload: false });
    }
  };

  // ========== 블로그 닫기 ==========
  const closeBlog = () => {
    dispatch({ type: ACTIONS.SET_GENERATED_BLOG, payload: null });
  };

  // ========== Context에 제공할 값 ==========
  const value = {
    // 상태
    ...state,

    // 액션 함수들
    fetchGitHubActivity,
    selectActivity,
    generateBlog,
    closeBlog,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ==================== Custom Hook ====================
// Context를 쉽게 사용하기 위한 커스텀 훅
export function useAppContext() {
  const context = useContext(AppContext);

  // Provider 밖에서 사용하면 에러 발생
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
