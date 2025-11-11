const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authApi = {
    login: () => {
        window.location.href = `${API_BASE_URL}/api/users/login`;
    },

    handleCallback: async (code: string) => {
        const response = await fetch(`${API_BASE_URL}/api/users/callback?code=${code}`);
        if (!response.ok) {
            throw new Error('Failed to authenticate');
        }
        return await response.json();
    }
};
