import { BRANCHES_API } from "../../constants/api";

export async function fetchRepoBranches(params: { repoFullName: string }) {
	const token = import.meta.env.VITE_GITHUB_TOKEN;
	if (!token || token.trim() === "") {
		throw new Error("Missing GitHub token. Set VITE_GITHUB_TOKEN in .env");
	}

	const url = new URL(BRANCHES_API);
	url.searchParams.set("repo", params.repoFullName);

	const res = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Accept: "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to load branches: ${res.status} ${text}`);
	}

	return await res.json();
}
