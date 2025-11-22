import { useQuery } from '@tanstack/react-query';
import { commitsApi } from '../api/commits';
import type { CommitItem } from '../types/githubCommit';

export const useCommits = (owner: string, repo: string) => {
    const accessToken = localStorage.getItem('access_token');

    return useQuery<CommitItem[], Error>({
        queryKey: ['commits', owner, repo],
        queryFn: () => {
            if (!accessToken) {
                throw new Error('No access token found');
            }
            return commitsApi.getCommits(accessToken, owner, repo);
        },
        enabled: !!accessToken && !!owner && !!repo,
    });
};
