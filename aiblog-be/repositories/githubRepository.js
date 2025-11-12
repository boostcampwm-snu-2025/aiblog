import { makeOctokit } from "../utils/octokit.js";
import { clamp } from "../utils/clamp.js";

export async function listMyReposRepo({
	token,
	per_page = 30,
	page = 1,
	sort = "updated",
	direction = "desc",
	visibility = "public", // public repo only
}) {
	const octokit = makeOctokit(token);

	const res = await octokit.repos.listForAuthenticatedUser({
		per_page: clamp(per_page, 1, 100),
		page,
		sort,
		direction,
		visibility: "public", // public repo only
	});

	return { repos: res.data ?? [] };
}

export async function listRepoBranchesRepo({
	token,
	owner,
	name,
	per_page = 100,
	page = 1,
}) {
	const octokit = makeOctokit(token);

	const res = await octokit.repos.listBranches({
		owner,
		repo: name,
		per_page: clamp(per_page, 1, 100),
		page,
	});

	const rateLimit = res.headers || {};
	const meta = {
		remaining: Number(rateLimit["x-ratelimit-remaining"]),
		limit: Number(rateLimit["x-ratelimit-limit"]),
		reset: Number(rateLimit["x-ratelimit-reset"]),
	};

	return { branches: res.data ?? [], meta };
}

export async function listRecentCommitsRepo({
	token,
	owner,
	name,
	since,
	until,
	per_page = 20,
	page = 1,
}) {
	const octokit = makeOctokit(token);

	const res = await octokit.repos.listCommits({
		owner,
		repo: name,
		since, // ISO 8601 (optional)
		until, // ISO 8601 (optional)
		per_page: clamp(per_page, 1, 100),
		page,
	});

	// rate limit info
	const rateLimit = res.headers || {};
	const meta = {
		remaining: Number(rateLimit["x-ratelimit-remaining"]),
		limit: Number(rateLimit["x-ratelimit-limit"]),
		reset: Number(rateLimit["x-ratelimit-reset"]),
	};

	return { commits: res.data ?? [], meta };
}

export async function listPullRequestsRepo({
	token,
	repoFullName,
	state = "all",
	per_page = 20,
	page = 1,
}) {
	const octokit = makeOctokit(token);

	const me = await octokit.users.getAuthenticated();
	const authorLogin = me?.data?.login;
	if (!authorLogin) {
		throw new Error("Failed to resolve authenticated user (login).");
	}

	const stateClause = state === "all" ? "" : ` is:${state}`;
	const q = `repo:${repoFullName} type:pr author:${authorLogin}${stateClause}`;

	const res = await octokit.search.issuesAndPullRequests({
		q,
		sort: "updated",
		order: "desc",
		per_page: clamp(per_page, 1, 100),
		page,
	});

	const rateLimit = res.headers || {};
	const meta = {
		remaining: Number(rateLimit["x-ratelimit-remaining"]),
		limit: Number(rateLimit["x-ratelimit-limit"]),
		reset: Number(rateLimit["x-ratelimit-reset"]),
	};

	const prs = (res.data?.items ?? []).map((item) => ({
		id: String(item.id),
		number: item.number,
		title: item.title,
		body: item.body || "",
		html_url: item.html_url,
		state: item.state,
		created_at: item.created_at,
		updated_at: item.updated_at,
		user: {
			login: item.user?.login,
			avatar_url: item.user?.avatar_url,
		},
		is_merged: Boolean(item.pull_request?.merged_at),
		repo: repoFullName,
	}));

	return {
		prs,
		total: res.data?.total_count ?? 0,
		page,
		per_page: clamp(per_page, 1, 100),
		meta,
	};
}

export async function getCommitByShaRepo({ token, owner, name, sha }) {
	const octokit = makeOctokit(token);
	const res = await octokit.repos.getCommit({
		owner,
		repo: name,
		ref: sha,
	});
	return res.data;
}

export async function getPRByNumberRepo({ token, owner, name, number }) {
	const octokit = makeOctokit(token);
	const res = await octokit.pulls.get({
		owner,
		repo: name,
		pull_number: number,
	});
	return res.data;
}

export async function assertRepoIsPublicRepo({ token, owner, name }) {
	const octokit = makeOctokit(token);
	const { data } = await octokit.repos.get({ owner, repo: name });
	if (data.private) {
		const err = new Error("Forbidden: private repository not allowed");
		err.status = 403;
		throw err;
	}
}
