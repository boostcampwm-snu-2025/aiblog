import type { CommitListResponse } from "../../types/githubCommitData";

import { RECENT_COMMITS_API } from "../../constants/api";

export async function fetchRecentCommits(
	repoFullName: string,
	perPage = 30,
	sha?: string
): Promise<CommitListResponse> {
	const token = import.meta.env.VITE_GITHUB_TOKEN;
	if (!token || token.trim() === "") {
		throw new Error(
			"Missing GitHub token. Set VITE_GITHUB_TOKEN in your .env file."
		);
	}

	const endpoint = `${RECENT_COMMITS_API}?repo=${encodeURIComponent(
		repoFullName
	)}&per_page=${perPage}${sha ? `&sha=${encodeURIComponent(sha)}` : ""}`;

	const res = await fetch(endpoint, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to load commits: ${res.status} ${text}`);
	}

	return (await res.json()) as CommitListResponse;
}
