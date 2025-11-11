import type { CommitItem } from "../types/githubCommit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const commitsApi = {
    getCommits: async (accessToken: string, owner: string, repo: string, perPage: number = 10): Promise<CommitItem[]> => {
        const response = await fetch(`${API_BASE_URL}/api/repos/commits?owner=${owner}&repo=${repo}&per_page=${perPage}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch commits');
        }
        const commits = await response.json();
        console.log('Fetched commits:', commits);
        return commits;
    }
};
