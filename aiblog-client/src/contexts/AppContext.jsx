import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Page navigation state
  const [page, setPage] = useState('main');

  // Input states
  const [repoName, setRepoName] = useState('');
  const [filterType, setFilterType] = useState('all');

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [githubData, setGithubData] = useState(null); // Stores successful data
  const [apiError, setApiError] = useState(null); // Stores error messages

  // --- New states for interaction ---
  /**
   * Stores the IDs of checked items (e.g., { 'id1', 'id2' })
   * Using a Set for efficient add/delete/has checks.
   */
  const [checkedCommits, setCheckedCommits] = useState(new Set());
  /**
   * Stores the full object of the currently selected item for detail view.
   */
  const [activeCommit, setActiveCommit] = useState(null);
  /**
   * Stores user notes for AI summary.
   */
  const [commitNotes, setCommitNotes] = useState({});
  // ------------------------------------

  const handleSubmit = useCallback(
    async (event) => {
      if (event) {
        event.preventDefault(); // Stop form submission
      }

      setIsLoading(true);
      setGithubData(null);
      setApiError(null);
      // Clear previous selections on new fetch
      setCheckedCommits(new Set());
      setActiveCommit(null);
      setCommitNotes({});

      try {
        const params = new URLSearchParams({
          repoName: repoName,
          filterType: filterType,
        });

        const response = await fetch(
          `http://localhost:4000/api/github/data?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch data');
        }

        setGithubData(data);
        console.log('GitHub data fetched:', data);
      } catch (error) {
        console.error('Fetch error:', error.message);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [repoName, filterType] // Dependencies for useCallback
  );

  // Memoize the context value
  const value = useMemo(
    () => ({
      page,
      setPage,
      repoName,
      setRepoName,
      isLoading,
      setIsLoading,
      filterType,
      setFilterType,
      handleSubmit,
      githubData,
      apiError,
      // Add new states and setters to context
      checkedCommits,
      setCheckedCommits,
      activeCommit,
      setActiveCommit,
      commitNotes,
      setCommitNotes,
    }),
    [
      page,
      repoName,
      isLoading,
      filterType,
      handleSubmit,
      githubData,
      apiError,
      checkedCommits,
      activeCommit,
      commitNotes,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom hook to consume the AppContext.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};