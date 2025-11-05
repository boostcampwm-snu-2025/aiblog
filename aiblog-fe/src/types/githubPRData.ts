export interface PRAuthor {
	name?: string;
	avatar_url?: string;
}

export interface PRItem {
	id: string | number;
	number: number;
	type: "pull_request";
	title: string;
	body?: string;
	html_url: string;
	state: "open" | "closed" | "all";
	is_merged?: boolean;
	repo: string; // "owner/name"
	time: string | null; // created_at or updated_at
	author?: PRAuthor;
}

export interface PRListResponse {
	items: PRItem[];
	total: number;
	page: number;
	per_page: number;
}
