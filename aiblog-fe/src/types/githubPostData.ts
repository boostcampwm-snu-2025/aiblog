import type { PromptLang, PromptTone } from "./promptSettings";
export interface PostGenerateRequest {
	repo: string;
	commits?: string[];
	prs?: number[];
	lang?: PromptLang;
	tone?: PromptTone;
}

export interface PostSourceCommit {
	id: string;
	title: string;
	body?: string;
	html_url?: string;
	author?: { name?: string; avatar_url?: string };
	time?: string;
}

export interface PostSourcePR {
	id: number;
	title: string;
	body?: string;
	html_url?: string;
	state?: string;
	merged?: boolean;
	author?: { name?: string; avatar_url?: string };
}

export interface PostGenerateResponse {
	post: {
		format: "markdown";
		content: string;
	};
	sources: {
		repo: string;
		commits?: PostSourceCommit[];
		prs?: PostSourcePR[];
	};
}
