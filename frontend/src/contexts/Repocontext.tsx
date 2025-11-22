import React, { createContext, useContext, useMemo, useState } from 'react';
import type { RepoItem } from '../types/githubRepo';
import type { CommitItem } from '../types/githubCommit';
import type { PRItem } from '../types/githubPR';
import { useRepos } from '../hooks/useRepos';
import { useCommits } from '../hooks/useCommits';
import { usePullRequests } from '../hooks/usePullRequests';

type FeedType = 'commits' | 'pullRequests';

interface RepoContextType {
    repos: RepoItem[];
    selectedRepo: RepoItem | null;
    setSelectedRepo: (repo: RepoItem | null) => void;
    selectRepo: (repoId: number) => void;
    selectedFeed: FeedType | null;
    setSelectedFeed: (feed: FeedType | null) => void;
    selectedCommit: CommitItem | null;
    setSelectedCommit: (commit: CommitItem | null) => void;
    selectedPullRequest: PRItem | null;
    setSelectedPullRequest: (pullRequest: PRItem | null) => void;
    commits: CommitItem[];
    pullRequests: PRItem[];
    loading: boolean;
    error: string | null;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedRepo, setSelectedRepoState] = useState<RepoItem | null>(null);
    const [selectedFeed, setSelectedFeedState] = useState<FeedType | null>(null);
    const [selectedCommit, setSelectedCommit] = useState<CommitItem | null>(null);
    const [selectedPullRequest, setSelectedPullRequest] = useState<PRItem | null>(null);

    const { data: repos = [], isLoading: reposLoading, error: reposError } = useRepos();

    const {
        data: commits = [],
        isLoading: commitsLoading,
        error: commitsError
    } = useCommits(
        selectedRepo?.owner_login || '',
        selectedRepo?.name || ''
    );

    const {
        data: pullRequests = [],
        isLoading: prsLoading,
        error: prsError
    } = usePullRequests(
        selectedRepo?.owner_login || '',
        selectedRepo?.name || ''
    );

    const loading = reposLoading || (selectedFeed === 'commits' && commitsLoading) || (selectedFeed === 'pullRequests' && prsLoading);
    const error = (reposError as Error)?.message || (commitsError as Error)?.message || (prsError as Error)?.message || null;

    const setSelectedRepo = (repo: RepoItem | null) => {
        setSelectedRepoState(repo);
        if (!repo) {
            setSelectedFeedState(null);
            setSelectedCommit(null);
            setSelectedPullRequest(null);
        }
    };

    const setSelectedFeed = (feed: FeedType | null) => {
        setSelectedFeedState(feed);
        if (feed === 'commits') {
            setSelectedPullRequest(null);
        } else if (feed === 'pullRequests') {
            setSelectedCommit(null);
        } else {
            setSelectedCommit(null);
            setSelectedPullRequest(null);
        }
    };

    const selectRepo = (repoId: number) => {
        const repo = repos.find(r => r.id === repoId);
        if (!repo) {
            return;
        }

        if (selectedRepo?.id !== repo.id) {
            setSelectedFeed(null);
        }

        setSelectedRepoState(repo);
        setSelectedCommit(null);
        setSelectedPullRequest(null);
    };

    const value = useMemo<RepoContextType>(() => ({
        repos,
        selectedRepo,
        setSelectedRepo,
        selectRepo,
        selectedFeed,
        setSelectedFeed,
        selectedCommit,
        setSelectedCommit,
        selectedPullRequest,
        setSelectedPullRequest,
        commits: selectedFeed === 'commits' ? commits : [],
        pullRequests: selectedFeed === 'pullRequests' ? pullRequests : [],
        loading,
        error,
    }), [
        repos,
        selectedRepo,
        selectedFeed,
        commits,
        pullRequests,
        loading,
        error,
        selectedCommit,
        selectedPullRequest,
    ]);

    return (
        <RepoContext.Provider value={value}>
            {children}
        </RepoContext.Provider>
    );
};

export const useRepoContext = () => {
    const context = useContext(RepoContext);
    if (!context) {
        throw new Error('useRepoContext must be used within a RepoProvider');
    }
    return context;
};

