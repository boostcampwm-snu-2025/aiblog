const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type ChangeType = 'commit' | 'pull_request';

export interface SummaryRequestPayload {
    change_type: ChangeType;
    owner: string;
    repo: string;
    sha?: string;
    number?: number;
    title?: string | null;
    description?: string | null;
    author?: string | null;
    html_url?: string | null;
}

export interface SummaryResponsePayload {
    summary: string;
    truncated: boolean;
}

export const summaryApi = {
    generateSummary: async (
        accessToken: string,
        payload: SummaryRequestPayload
    ): Promise<SummaryResponsePayload> => {
        const response = await fetch(`${API_BASE_URL}/api/repos/summary`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = 'Failed to generate summary';
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.detail || errorMessage;
            } catch {
                const fallback = await response.text();
                if (fallback) {
                    errorMessage = fallback;
                }
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }
};
