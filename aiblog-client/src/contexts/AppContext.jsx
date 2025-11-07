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

  /**
   * Fetches data from the Express server's proxy endpoint.
   */
  const handleSubmit = useCallback(
    async (event) => {
      if (event) {
        event.preventDefault(); // Stop form submission
      }

      // 1. Set loading state and clear previous results
      setIsLoading(true);
      setGithubData(null);
      setApiError(null);

      try {
        // 2. Construct the URL with query parameters
        const params = new URLSearchParams({
          repoName: repoName,
          filterType: filterType,
        });

        // 3. Call the Express server endpoint
        const response = await fetch(
          `http://localhost:4000/api/github/data?${params.toString()}`
        );

        const data = await response.json();

        // 4. Handle server-side errors (e.g., 404, 500)
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch data');
        }

        // 5. Success: Store the data
        setGithubData(data);
        console.log('GitHub data fetched:', data);
      } catch (error) {
        // 6. Handle fetch errors (network or thrown errors)
        console.error('Fetch error:', error.message);
        setApiError(error.message);
      } finally {
        // 7. Always stop loading
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
      setIsLoading, // Keep for potential manual control
      filterType,
      setFilterType,
      handleSubmit,
      githubData,
      apiError,
    }),
    [
      page,
      repoName,
      isLoading,
      filterType,
      handleSubmit,
      githubData,
      apiError,
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