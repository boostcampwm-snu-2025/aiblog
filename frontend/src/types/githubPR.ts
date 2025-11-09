export interface PRItem {
    id: number;
    number: number;
    title: string;
    body: string;
    state: 'open' | 'closed' | 'merged';
    created_at: string;
    updated_at: string;
    merged_at: string | null;
    author_login: string;
    author_avatar_url: string;
    html_url: string;
}