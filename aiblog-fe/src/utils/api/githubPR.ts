import type { PRListResponse } from "../../types/githubPRData";
import { MY_PULL_REQUESTS_API } from "../../constants/api";

export async function fetchMyPullRequests(params: {
	repoFullName: string; // "owner/name"
	state?: "open" | "closed" | "all";
	per_page?: number;
	page?: number;
}): Promise<PRListResponse> {
	const token = import.meta.env.VITE_GITHUB_TOKEN;
	if (!token || token.trim() === "") {
		throw new Error(
			"Missing GitHub token. Set VITE_GITHUB_TOKEN in your .env file."
		);
	}

	const { repoFullName, state = "all", per_page = 30, page = 1 } = params;

	const query = new URLSearchParams({
		repo: repoFullName,
		state,
		per_page: String(per_page),
		page: String(page),
	});

	const res = await fetch(`${MY_PULL_REQUESTS_API}?${query.toString()}`, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to load PRs: ${res.status} ${text}`);
	}

	return (await res.json()) as PRListResponse;
}
