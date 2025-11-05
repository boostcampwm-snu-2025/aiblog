export interface RepoOwner {
	login?: string;
	avatar_url?: string;
	type?: "User" | "Organization" | string;
}

export interface RepoItem {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	html_url: string;
	description?: string;
	default_branch?: string;
	language?: string | null;
	pushed_at?: string | null;
	updated_at?: string | null;
	owner?: RepoOwner;
}

export interface RepoListResponse {
	items: RepoItem[];
}
