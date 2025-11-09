export interface RepoItem {
    id: number;
    full_name: string;
    name: string;
    html_url: string;
    description: string | null;
    default_branch: string | null;
    pushed_at: string | null;
    updated_at: string | null;
    owner_login: string;
    owner_avatar_url: string;
}