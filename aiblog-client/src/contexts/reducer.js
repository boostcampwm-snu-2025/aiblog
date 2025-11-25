import * as Actions from './action';

export const initialState = {
  repoName: '',
  filterType: 'all',

  fetchStatus: 'idle',
  githubData: null,
  apiError: null,

  checkedCommits: new Set(),
  activeCommit: null,
  commitNotes: {},

  generateStatus: 'idle',
  generatedContent: null,
  generationError: null,
};

export function mainPageReducer(state, action) {
  switch (action.type) {
    case Actions.SET_REPO_NAME:
      return { ...state, repoName: action.payload };
    case Actions.SET_FILTER_TYPE:
      return { ...state, filterType: action.payload };

    case Actions.FETCH_INIT:
      return {
        ...state,
        fetchStatus: 'loading',
        githubData: null,
        apiError: null,
        
        checkedCommits: new Set(),
        activeCommit: null,
        commitNotes: {},
        
        generateStatus: 'idle',
        generatedContent: null,
        generationError: null,
      };

    case Actions.FETCH_SUCCESS:
      return {
        ...state,
        fetchStatus: 'success',
        githubData: action.payload,
        apiError: null,
      };

    case Actions.FETCH_FAILURE:
      return {
        ...state,
        fetchStatus: 'error',
        githubData: null,
        apiError: action.payload,
      };

    case Actions.SET_CHECKED_COMMITS:
      return { ...state, checkedCommits: action.payload };
    case Actions.SET_ACTIVE_COMMIT:
      return { ...state, activeCommit: action.payload };
    case Actions.UPDATE_COMMIT_NOTE: {
      const { id, note } = action.payload;
      return {
        ...state,
        commitNotes: { ...state.commitNotes, [id]: note },
      };
    }
    case Actions.CLEAR_SELECTION:
      return {
        ...state,
        checkedCommits: new Set(),
        activeCommit: null,
        commitNotes: {},
      };

    case Actions.GENERATE_INIT:
      return {
        ...state,
        generateStatus: 'loading',
        generatedContent: null,
        generationError: null,
      };
    case Actions.GENERATE_SUCCESS:
      return {
        ...state,
        generateStatus: 'success',
        generatedContent: action.payload,
        generationError: null,
      };
    case Actions.GENERATE_FAILURE:
      return {
        ...state,
        generateStatus: 'error',
        generatedContent: null,
        generationError: action.payload,
      };
    case Actions.CLEAR_GENERATION:
      return {
        ...state,
        generateStatus: 'idle',
        generatedContent: null,
        generationError: null,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}