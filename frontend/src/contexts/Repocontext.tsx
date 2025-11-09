import React, { createContext, useContext, useState } from 'react';
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
    const [selectedFeed, setSelectedFeed] = useState<FeedType | null>(null);
    const [commits, setCommits] = useState<CommitItem[]>([]);
    const [pullRequests, setPullRequests] = useState<PRItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { setIsLoggedIn } = useAppContext();

    const setSelectedRepo = (repo: RepoItem | null) => {
        setSelectedRepoState(repo);
        if (!repo) {
            setSelectedFeed(null);
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

    return (
        <RepoContext.Provider
            value={{
                repos,
                setRepos,
                selectedRepo,
                setSelectedRepo,
                selectRepo,
                selectedFeed,
                setSelectedFeed,
                commits,
                setCommits,
                pullRequests,
                setPullRequests,
                loading,
                error,
                fetchRepos,
                fetchRepoCommits,
                fetchRepoPullRequests
            }}
        >
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

