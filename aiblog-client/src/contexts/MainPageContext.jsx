import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import { mainPageReducer, initialState } from '@/contexts/reducer';
import * as Actions from '@/contexts/action';

const MainPageContext = createContext(null);

export function MainPageProvider({ children }) {
  const [state, dispatch] = useReducer(mainPageReducer, initialState);

  const {
    repoName,
    filterType,
    fetchStatus,
    githubData,
    apiError,
    checkedCommits,
    activeCommit,
    commitNotes,
    generateStatus,
    generatedContent,
    generationError,
  } = state;

  const setRepoName = useCallback((name) => {
    dispatch({ type: Actions.SET_REPO_NAME, payload: name });
  }, []);

  const setFilterType = useCallback((type) => {
    dispatch({ type: Actions.SET_FILTER_TYPE, payload: type });
  }, []);

  const setCheckedCommits = useCallback((newSet) => {
    dispatch({ type: Actions.SET_CHECKED_COMMITS, payload: newSet });
  }, []);

  const setActiveCommit = useCallback((commit) => {
    dispatch({ type: Actions.SET_ACTIVE_COMMIT, payload: commit });
  }, []);

  const setCommitNotes = useCallback((notesUpdater) => {
  }, []);
  
  const updateCommitNote = useCallback((id, note) => {
    dispatch({ type: Actions.UPDATE_COMMIT_NOTE, payload: { id, note } });
  }, []);

  const setIsGenerating = useCallback((isGenerating) => {
    if (isGenerating) dispatch({ type: Actions.GENERATE_INIT });
  }, []);

  const setGeneratedContent = useCallback((content) => {
    if (content) {
        dispatch({ type: Actions.GENERATE_SUCCESS, payload: content });
    } else {
        dispatch({ type: Actions.CLEAR_GENERATION });
    }
  }, []);

  const setGenerationError = useCallback((error) => {
    if (error) dispatch({ type: Actions.GENERATE_FAILURE, payload: error });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();

      dispatch({ type: Actions.FETCH_INIT });

      try {
        const params = new URLSearchParams({
          repoName: state.repoName,
          filterType: state.filterType,
        });

        const response = await fetch(
          `http://localhost:4000/api/github/data?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch data');
        }

        dispatch({ type: Actions.FETCH_SUCCESS, payload: data });
      } catch (error) {
        console.error('Fetch error:', error.message);
        dispatch({ type: Actions.FETCH_FAILURE, payload: error.message });
      }
    },
    [state.repoName, state.filterType]
  );

  const value = useMemo(
    () => ({
      ...state,
      isLoading: fetchStatus === 'loading',
      isGenerating: generateStatus === 'loading',
      
      setRepoName,
      setFilterType,
      setCheckedCommits,
      setActiveCommit,
      // setCommitNotes: (Deprecated) -> updateCommitNote 사용 권장
      updateCommitNote, 
      
      setIsGenerating,
      setGeneratedContent,
      setGenerationError,

      handleSubmit,
      dispatch,
    }),
    [
      state,
      fetchStatus,
      generateStatus,
      setRepoName,
      setFilterType,
      setCheckedCommits,
      setActiveCommit,
      updateCommitNote,
      setIsGenerating,
      setGeneratedContent,
      setGenerationError,
      handleSubmit,
    ]
  );

  return (
    <MainPageContext.Provider value={value}>
      {children}
    </MainPageContext.Provider>
  );
}

export const useMainPageContext = () => {
  const context = useContext(MainPageContext);
  if (!context) {
    throw new Error('useMainPageContext must be used within a MainPageProvider');
  }
  return context;
};