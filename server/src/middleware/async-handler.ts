import type { OctokitResponse } from "@octokit/types";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncGithubHandler = (
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

export const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};
