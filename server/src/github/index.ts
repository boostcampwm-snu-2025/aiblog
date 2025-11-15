import { Router } from "express";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { Octokit, RequestError } from "octokit";
import { ZodError } from "zod";
import env from "../env.js";
import {
	branchSchema,
	commitSchema,
	pullRequestSchema,
	repoSchema,
} from "./schema.js";

const router: Router = Router();

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

// Async handler wrapper - try-catch 반복 제거
const asyncHandler = (fn: RequestHandler): RequestHandler => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

router.get("/repos/:owner/:repo", asyncHandler(async (req, res) => {
	const params = repoSchema.parse(req.params);
	const response = await octokit.rest.repos.get(params);

	// Rate limit 정보를 response header에 추가
	res.set({
		"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
		"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
		"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
	});

	res.json(response.data);
}));

router.get("/repos/:owner/:repo/branches", asyncHandler(async (req, res) => {
	const params = repoSchema.parse(req.params);
	const response = await octokit.rest.repos.listBranches(params);

	res.set({
		"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
		"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
		"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
	});

	res.json(response.data);
}));

router.get("/repos/:owner/:repo/branches/:branch/commits", asyncHandler(async (req, res) => {
	const params = branchSchema.parse(req.params);
	const response = await octokit.rest.repos.listCommits({
		owner: params.owner,
		repo: params.repo,
		sha: params.branch,
	});

	res.set({
		"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
		"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
		"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
	});

	res.json(response.data);
}));

router.get("/repos/:owner/:repo/commits/:ref", asyncHandler(async (req, res) => {
	const params = commitSchema.parse(req.params);
	const response = await octokit.rest.repos.getCommit(params);

	res.set({
		"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
		"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
		"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
	});

	res.json(response.data);
}));

router.get("/repos/:owner/:repo/pulls", asyncHandler(async (req, res) => {
	const params = repoSchema.parse(req.params);
	const response = await octokit.rest.pulls.list(params);

	res.set({
		"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
		"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
		"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
	});

	res.json(response.data);
}));

router.get(
	"/repos/:owner/:repo/pulls/:pull_number/commits",
	asyncHandler(async (req, res) => {
		const params = pullRequestSchema.parse(req.params);
		const response = await octokit.rest.pulls.listCommits(params);

		res.set({
			"X-RateLimit-Limit": response.headers["x-ratelimit-limit"],
			"X-RateLimit-Remaining": response.headers["x-ratelimit-remaining"],
			"X-RateLimit-Reset": response.headers["x-ratelimit-reset"],
		});

		res.json(response.data);
	}),
);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	// Zod validation error
	if (error instanceof ZodError) {
		return res.status(400).json({
			error: "Validation failed",
			details: error.issues,
		});
	}

	// Octokit RequestError
	if (error instanceof RequestError) {
		const status = error.status;
		const message = error.message;
		return res.status(status).json({
			error: message,
		});
	}

	// Unknown error
	console.error("Unexpected error:", error);
	return res.status(500).json({
		error: "Internal server error",
	});
};

router.use(errorHandler);

export default router;
