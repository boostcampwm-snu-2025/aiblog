import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // Page State
    const [page, setPage] = useState('main');
  
    // Input UI State
    const [repoName, setRepoName] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'commits', 'prs'
    const [isLoading, setIsLoading] = useState(false);

    // Data & Selection State
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [checkedCommits, setCheckedCommits] = useState(new Set());
    const [activeCommit, setActiveCommit] = useState(null);
    const [commitNotes, setCommitNotes] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Request Start:', { repoName, filterType });
        setIsLoading(true);
        setError(null);
        setData(null);

        // TODO: Fetch data from Express server (W1 Checklist 5.3)
        // ... fetch logic will go here ...

        // Simulate API call for 2 seconds
        setTimeout(() => {
        setIsLoading(false);
        console.log('Request simulation ended');
        }, 2000);
    };

    const value = {
        page,
        setPage,
        repoName,
        setRepoName,
        filterType,
        setFilterType,
        isLoading,
        setIsLoading,
        data,
        setData,
        error,
        setError,
        checkedCommits,
        setCheckedCommits,
        activeCommit,
        setActiveCommit,
        commitNotes,
        setCommitNotes,
        handleSubmit,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}