import React, { createContext, useContext, useMemo, useState } from 'react';
import type { RepoItem } from '../types/githubRepo';
import type { CommitItem } from '../types/githubCommit';
import type { PRItem } from '../types/githubPR';
import { reposApi } from '../api/repos';
import { commitsApi } from '../api/commits';
import { useAppContext } from './Appcontext';
import { pullRequestsApi } from '../api/pullRequests';

type FeedType = 'commits' | 'pullRequests';

interface RepoContextType {
    repos: RepoItem[];
    setRepos: (repos: RepoItem[]) => void;
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
    setCommits: (commits: CommitItem[]) => void;
    pullRequests: PRItem[];
    setPullRequests: (prs: PRItem[]) => void;
    loading: boolean;
    error: string | null;
    fetchRepos: () => Promise<void>;
    fetchRepoCommits: (repo: RepoItem) => Promise<void>;
    fetchRepoPullRequests: (repo: RepoItem) => Promise<void>;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [repos, setRepos] = useState<RepoItem[]>([]);
    const [selectedRepo, setSelectedRepoState] = useState<RepoItem | null>(null);
    const [selectedFeed, setSelectedFeedState] = useState<FeedType | null>(null);
    const [selectedCommit, setSelectedCommit] = useState<CommitItem | null>(null);
    const [selectedPullRequest, setSelectedPullRequest] = useState<PRItem | null>(null);
    const [commits, setCommits] = useState<CommitItem[]>([]);
    const [pullRequests, setPullRequests] = useState<PRItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { setIsLoggedIn } = useAppContext();

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

    const fetchRepos = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reposData = await reposApi.getRepos(accessToken);
            setRepos(reposData);
            if (setIsLoggedIn) {
                setIsLoggedIn(true);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories';
            setError(errorMessage);
            console.error('Error fetching repos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepoCommits = async (repo: RepoItem) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found');
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedCommit(null);
        setSelectedPullRequest(null);

        try {
            const commitsData = await commitsApi.getCommits(accessToken, repo.owner_login, repo.name);
            setCommits(commitsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch commits';
            setError(errorMessage);
            console.error('Error fetching commits:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepoPullRequests = async (repo: RepoItem) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found');
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedCommit(null);
        setSelectedPullRequest(null);

        try {
            const prsData = await pullRequestsApi.getPullRequests(accessToken, repo.owner_login, repo.name);
            setPullRequests(prsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pull requests';
            setError(errorMessage);
            console.error('Error fetching pull requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo<RepoContextType>(() => ({
        repos,
        setRepos,
        selectedRepo,
        setSelectedRepo,
        selectRepo,
        selectedFeed,
        setSelectedFeed,
        selectedCommit,
        setSelectedCommit,
        selectedPullRequest,
        setSelectedPullRequest,
        commits,
        setCommits,
        pullRequests,
        setPullRequests,
        loading,
        error,
        fetchRepos,
        fetchRepoCommits,
        fetchRepoPullRequests,
    }), [
        repos,
        selectedRepo,
        selectedFeed,
        commits,
        pullRequests,
        loading,
        error,
        fetchRepos,
        fetchRepoCommits,
        fetchRepoPullRequests,
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

