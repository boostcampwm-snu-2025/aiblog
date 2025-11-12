import {
	listMyReposService,
	listRecentCommitsService,
	listMyPullRequestsService,
	listRepoBranchesService,
} from "../services/githubDataService.js";
import {
	validateRecentCommitsQuery,
	validateMyReposQuery,
	validateMyPullRequestsQuery,
	validateBranchesQuery,
} from "../models/githubModels.js";
import { getBearerToken } from "../utils/auth.js";

export async function getMyRepos(req, res, next) {
	try {
		const token = getBearerToken(req);

		const query = validateMyReposQuery({
			per_page: req.query.per_page,
			page: req.query.page,
			sort: req.query.sort,
			direction: req.query.direction,
			visibility: "public", // public repo only
		});

		const result = await listMyReposService({
			token,
			per_page: query.per_page,
			page: query.page,
			sort: query.sort,
			direction: query.direction,
			visibility: query.visibility,
		});

		if (result.meta) {
			const { remaining, limit, reset } = result.meta;
			if (remaining != null)
				res.set("x-ratelimit-remaining", String(remaining));
			if (limit != null) res.set("x-ratelimit-limit", String(limit));
			if (reset != null) res.set("x-ratelimit-reset", String(reset));
			if (result.link) res.set("link", result.link); // GitHub pagination Link header 그대로 전달(옵션)
		}

		res.json({ items: result.items });
	} catch (err) {
		next(err);
	}
}

export async function getRepoBranches(req, res, next) {
	try {
		const token = getBearerToken(req);
		const query = validateBranchesQuery({
			repo: req.query.repo,
			per_page: req.query.per_page,
			page: req.query.page,
		});

		const [owner, name] = query.repo.split("/");

		const result = await listRepoBranchesService({
			token,
			owner,
			name,
			per_page: query.per_page,
			page: query.page,
		});

		if (result.meta) {
			const { remaining, limit, reset } = result.meta;
			if (remaining != null)
				res.set("x-ratelimit-remaining", String(remaining));
			if (limit != null) res.set("x-ratelimit-limit", String(limit));
			if (reset != null) res.set("x-ratelimit-reset", String(reset));
		}

		res.json({ items: result.items });
	} catch (err) {
		next(err);
	}
}

export async function getRecentCommits(req, res, next) {
	try {
		const token = getBearerToken(req);
		const query = validateRecentCommitsQuery({
			repo: req.query.repo,
			since: req.query.since,
			until: req.query.until,
			per_page: req.query.per_page,
			page: req.query.page,
		});

		const [owner, name] = query.repo.split("/");

		const result = await listRecentCommitsService({
			token,
			owner,
			name,
			since: query.since,
			until: query.until,
			per_page: query.per_page,
			page: query.page,
		});

		if (result.meta) {
			const { remaining, limit, reset } = result.meta;
			if (remaining != null)
				res.set("x-ratelimit-remaining", String(remaining));
			if (limit != null) res.set("x-ratelimit-limit", String(limit));
			if (reset != null) res.set("x-ratelimit-reset", String(reset));
		}

		res.json({ items: result.items });
	} catch (err) {
		next(err);
	}
}

export async function getMyPullRequests(req, res, next) {
	try {
		const token = getBearerToken(req);

		const query = validateMyPullRequestsQuery({
			repo: req.query.repo,
			state: req.query.state,
			per_page: req.query.per_page,
			page: req.query.page,
		});

		const result = await listMyPullRequestsService({
			token,
			repoFullName: query.repo,
			state: query.state,
			per_page: query.per_page,
			page: query.page,
		});

		if (result.meta) {
			const { remaining, limit, reset } = result.meta;
			if (remaining != null)
				res.set("x-ratelimit-remaining", String(remaining));
			if (limit != null) res.set("x-ratelimit-limit", String(limit));
			if (reset != null) res.set("x-ratelimit-reset", String(reset));
		}

		res.json({
			items: result.items,
			total: result.total,
			page: result.page,
			per_page: result.per_page,
		});
	} catch (err) {
		next(err);
	}
}
