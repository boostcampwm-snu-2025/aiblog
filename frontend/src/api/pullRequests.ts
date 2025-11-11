import type { PRItem } from "../types/githubPR";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const pullRequestsApi = {
    getPullRequests: async (accessToken: string, owner: string, repo: string): Promise<PRItem[]> => {
        const response = await fetch(`${API_BASE_URL}/api/repos/prs?owner=${owner}&repo=${repo}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch pull requests');
        }
        const pullRequests = await response.json();
        console.log('Fetched pull requests:', pullRequests);
        return pullRequests;
    }
};
