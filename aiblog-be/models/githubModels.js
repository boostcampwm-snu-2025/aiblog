export function validateMyReposQuery(query) {
	const out = {
		per_page: query.per_page ? Number(query.per_page) : 30,
		page: query.page ? Number(query.page) : 1,
		sort: (query.sort || "updated").toString(), // created | updated | pushed | full_name
		direction: (query.direction || "desc").toString(), // asc | desc
		visibility: "public", // public repo only
	};

	if (Number.isNaN(out.per_page) || out.per_page < 1) out.per_page = 30;
	if (Number.isNaN(out.page) || out.page < 1) out.page = 1;

	const allowedSort = new Set(["created", "updated", "pushed", "full_name"]);
	if (!allowedSort.has(out.sort)) out.sort = "updated";

	const allowedDir = new Set(["asc", "desc"]);
	if (!allowedDir.has(out.direction)) out.direction = "desc";

	const allowedVis = new Set(["public"]); // public repo only
	if (out.visibility && !allowedVis.has(out.visibility))
		out.visibility = "public";

	return out;
}

export function normalizeRepoItems(repos) {
	return (repos || []).map((repo) => ({
		id: repo.id,
		name: repo.name,
		full_name: repo.full_name,
		private: !!repo.private,
		html_url: repo.html_url,
		description: repo.description || undefined,
		default_branch: repo.default_branch,
		pushed_at: repo.pushed_at,
		updated_at: repo.updated_at,
		language: repo.language || undefined,
		owner: {
			login: repo.owner?.login,
			avatar_url: repo.owner?.avatar_url,
			type: repo.owner?.type, // User | Organization
		},
	}));
}

export function validateBranchesQuery(query) {
	const out = {
		repo: String(query.repo || "").trim(),
		per_page: query.per_page ? Number(query.per_page) : 100,
		page: query.page ? Number(query.page) : 1,
	};

	if (!out.repo || !out.repo.includes("/")) {
		const err = new Error('Invalid query: repo must be "owner/name"');
		err.status = 400;
		throw err;
	}
	if (Number.isNaN(out.per_page) || out.per_page < 1) out.per_page = 100;
	if (Number.isNaN(out.page) || out.page < 1) out.page = 1;

	return out;
}

export function normalizeBranchItems(branches) {
	return (branches || []).map((b) => ({
		name: b.name,
		protected: !!b.protected,
		commit_sha: b.commit?.sha || null,
	}));
}

export function validateRecentCommitsQuery(query) {
	const out = {
		repo: String(query.repo || "").trim(),
		since: query.since ? new Date(query.since).toISOString() : undefined,
		until: query.until ? new Date(query.until).toISOString() : undefined,
		per_page: query.per_page ? Number(query.per_page) : 20,
		page: query.page ? Number(query.page) : 1,
		sha: query.sha ? String(query.sha).trim() : undefined,
	};

	if (!out.repo || !out.repo.includes("/")) {
		const err = new Error('Invalid query: repo must be "owner/name"');
		err.status = 400;
		throw err;
	}
	if (Number.isNaN(out.per_page) || out.per_page < 1) out.per_page = 20;
	if (Number.isNaN(out.page) || out.page < 1) out.page = 1;

	if (query.since && Number.isNaN(Date.parse(query.since))) {
		const err = new Error("Invalid query: since must be ISO date string");
		err.status = 400;
		throw err;
	}
	if (query.until && Number.isNaN(Date.parse(query.until))) {
		const err = new Error("Invalid query: until must be ISO date string");
		err.status = 400;
		throw err;
	}

	if (out.sha === "") out.sha = undefined;

	return out;
}

export function normalizeCommitItems(commits) {
	return (commits || []).map((c) => {
		const sha = c.sha;
		const commit = c.commit || {};
		const author = commit.author || {};
		const message = String(commit.message || "");
		const [title, ...rest] = message.split("\n");
		const body = rest.join("\n").trim();

		return {
			id: sha,
			type: "commit",
			title: title || "(no message)",
			body: body || undefined,
			html_url: c.html_url,
			time: author.date || c.committer?.date || commit?.committer?.date || null,
			stats: undefined,
			author: {
				name: author.name || c.author?.login || undefined,
				avatar_url: c.author?.avatar_url || undefined,
			},
		};
	});
}

export function validateMyPullRequestsQuery(query) {
	const out = {
		repo: String(query.repo || "").trim(),
		state: (query.state || "all").toString(), // open | closed | all
		per_page: query.per_page ? Number(query.per_page) : 20,
		page: query.page ? Number(query.page) : 1,
	};

	if (!out.repo || !out.repo.includes("/")) {
		const err = new Error('Invalid query: repo must be "owner/name"');
		err.status = 400;
		throw err;
	}

	const allowedStates = new Set(["open", "closed", "all"]);
	if (!allowedStates.has(out.state)) out.state = "all";

	if (Number.isNaN(out.per_page) || out.per_page < 1) out.per_page = 20;
	if (Number.isNaN(out.page) || out.page < 1) out.page = 1;

	return out;
}

export function normalizePrItems(prs) {
	return (prs || []).map((pr) => ({
		id: pr.id,
		number: pr.number,
		type: "pull_request",
		title: pr.title || "(no title)",
		body: pr.body || undefined,
		html_url: pr.html_url,
		state: pr.state,
		is_merged: !!pr.is_merged,
		repo: pr.repo,
		time: pr.created_at || pr.updated_at || null,
		author: {
			name: pr.user?.login || undefined,
			avatar_url: pr.user?.avatar_url || undefined,
		},
	}));
}
