import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

const MainPageContext = createContext(null);

export function MainPageProvider({ children }) {
  // Input states
  const [repoName, setRepoName] = useState('');
  const [filterType, setFilterType] = useState('all');

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Interaction states
  const [checkedCommits, setCheckedCommits] = useState(new Set());
  const [activeCommit, setActiveCommit] = useState(null);
  const [commitNotes, setCommitNotes] = useState({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  
  const handleSubmit = useCallback(
    async (event) => {
      if (event) {
        event.preventDefault();
      }

      setIsLoading(true);
      setGithubData(null);
      setApiError(null);
      setCheckedCommits(new Set());
      setActiveCommit(null);
      setCommitNotes({});
      setGeneratedContent(null);
      setGenerationError(null);

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
      } catch (error) {
        console.error('Fetch error:', error.message);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [repoName, filterType]
  );

  const value = useMemo(
    () => ({
      repoName,
      setRepoName,
      filterType,
      setFilterType,
      isLoading,
      githubData,
      apiError,
      checkedCommits,
      setCheckedCommits,
      activeCommit,
      setActiveCommit,
      commitNotes,
      setCommitNotes,
      handleSubmit,

      isGenerating,
      setIsGenerating,
      generatedContent,
      setGeneratedContent,
      generationError,
      setGenerationError,
    }),
    [
      repoName,
      filterType,
      isLoading,
      githubData,
      apiError,
      checkedCommits,
      activeCommit,
      commitNotes,
      handleSubmit,

      isGenerating,
      generatedContent,
      generationError,
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