import type { OctokitResponse } from "@octokit/types";
import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import { Router } from "express";
import { Octokit, RequestError } from "octokit";
import z, { ZodError } from "zod";
import env from "../env.js";
import {
	branchSchema,
	commitSchema,
	pageSchema,
	pullRequestSchema,
	querySchema,
	repoSchema,
} from "./schema.js";

const router: Router = Router();

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

const asyncGithubHandler = (
	fn: (
		req: Request,
		res: Response,
		next: NextFunction,
	) => Promise<OctokitResponse<unknown>>,
): RequestHandler => {
	return async (req, res, next) => {
		try {
			const response = await fn(req, res, next);
			res.set({
				"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
				"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
				"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
			});
			res.status(response.status).json(response.data);
		} catch (error) {
			next(error);
		}
	};
};

router.get(
	"/orgs/:org/repos",
	asyncGithubHandler(async (req) => {
		const schema = z.object({
			org: z.string(),
		});
		const params = schema.parse(req.params);
		const query = pageSchema.parse(req.query);
		return await octokit.rest.repos.listForOrg({
			...params,
			...query,
		});
	}),
);

router.get(
	"/repos/:owner/:repo",
	asyncGithubHandler(async (req) => {
		const params = repoSchema.parse(req.params);
		return await octokit.rest.repos.get(params);
	}),
);

router.get(
	"/repos/:owner/:repo/branches",
	asyncGithubHandler(async (req) => {
		const params = repoSchema.parse(req.params);
		return await octokit.rest.repos.listBranches(params);
	}),
);

router.get(
	"/repos/:owner/:repo/branches/:branch/commits",
	asyncGithubHandler(async (req) => {
		const params = branchSchema.parse(req.params);
		return await octokit.rest.repos.listCommits({
			owner: params.owner,
			repo: params.repo,
			sha: params.branch,
		});
	}),
);

router.get(
	"/repos/:owner/:repo/commits/:ref",
	asyncGithubHandler(async (req) => {
		const params = commitSchema.parse(req.params);
		return await octokit.rest.repos.getCommit(params);
	}),
);

router.get(
	"/repos/:owner/:repo/pulls",
	asyncGithubHandler(async (req) => {
		const params = repoSchema.parse(req.params);
		return await octokit.rest.pulls.list(params);
	}),
);

router.get(
	"/repos/:owner/:repo/pulls/:pull_number/commits",
	asyncGithubHandler(async (req) => {
		const params = pullRequestSchema.parse(req.params);
		return await octokit.rest.pulls.listCommits(params);
	}),
);

router.get(
	"/search/repositories",
	asyncGithubHandler(async (req) => {
		const schema = z.object({
			...querySchema.shape,
			...pageSchema.shape,
		});
		const query = schema.parse(req.query);
		return await octokit.rest.search.repos(query);
	}),
);

router.get(
	"/users/:username/repos",
	asyncGithubHandler(async (req) => {
		const schema = z.object({
			username: z.string(),
		});
		const params = schema.parse(req.params);
		const query = pageSchema.parse(req.query);
		return await octokit.rest.repos.listForUser({
			...params,
			...query,
		});
	}),
);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	if (error instanceof ZodError) {
		return res.status(400).json({
			error: "Validation failed",
			details: error.issues,
		});
	}

	if (error instanceof RequestError) {
		const status = error.status;
		const message = error.message;
		return res.status(status).json({
			error: message,
		});
	}

	console.error("Unexpected error:", error);
	return res.status(500).json({
		error: "Internal server error",
	});
};

router.use(errorHandler);

export default router;
