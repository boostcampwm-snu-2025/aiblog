import { MY_REPOS_API } from "../../constants/api";
import type { RepoListResponse } from "../../types/githubRepoData";

export async function fetchMyPublicRepos(): Promise<RepoListResponse> {
	const token = import.meta.env.VITE_GITHUB_TOKEN;

	if (!token || token.trim() === "") {
		throw new Error(
			"Missing GitHub token. Set VITE_GITHUB_TOKEN in your .env file."
		);
	}

	const res = await fetch(MY_REPOS_API, {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to load repos: ${res.status} ${text}`);
	}

	return (await res.json()) as RepoListResponse;
}
