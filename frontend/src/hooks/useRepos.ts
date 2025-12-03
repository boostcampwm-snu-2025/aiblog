import { useQuery } from '@tanstack/react-query';
import { reposApi } from '../api/repos';
import type { RepoItem } from '../types/githubRepo';

export const useRepos = () => {
    const accessToken = localStorage.getItem('access_token');

    return useQuery<RepoItem[], Error>({
        queryKey: ['repos'],
        queryFn: () => {
            if (!accessToken) {
                throw new Error('No access token found');
            }
            return reposApi.getRepos(accessToken);
        },
        enabled: !!accessToken,
    });
};
