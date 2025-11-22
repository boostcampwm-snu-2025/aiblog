import { useQuery } from '@tanstack/react-query';
import { pullRequestsApi } from '../api/pullRequests';
import type { PRItem } from '../types/githubPR';

export const usePullRequests = (owner: string, repo: string) => {
    const accessToken = localStorage.getItem('access_token');

    return useQuery<PRItem[], Error>({
        queryKey: ['pullRequests', owner, repo],
        queryFn: () => {
            if (!accessToken) {
                throw new Error('No access token found');
            }
            return pullRequestsApi.getPullRequests(accessToken, owner, repo);
        },
        enabled: !!accessToken && !!owner && !!repo,
    });
};
