export interface CommitAuthor {
	name?: string;
	avatar_url?: string;
}
export interface CommitItem {
	id: string;
	type: "commit";
	title: string;
	body?: string;
	html_url: string;
	time: string; // ISO
	author?: CommitAuthor;
}
export interface CommitListResponse {
	items: CommitItem[];
}
