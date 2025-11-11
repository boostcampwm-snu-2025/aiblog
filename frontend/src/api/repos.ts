import type { RepoItem } from '../types/githubRepo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const reposApi = {
    // Get user repositories
    getRepos: async (accessToken: string): Promise<RepoItem[]> => {
        const response = await fetch(`${API_BASE_URL}/api/repos`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const repos = await response.json();
        console.log('Fetched repos:', repos);
        return repos;
    }
};
