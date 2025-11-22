import type { NextFunction, Request, Response } from "express";
import z from "zod";
import {
	branchSchema,
	commitSchema,
	orgSchema,
	pageSchema,
	pullRequestSchema,
	querySchema,
	repoSchema,
	usernameSchema,
} from "../schemas/github.schema";
import * as githubService from "../services/github.service";

export async function getRepository(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = repoSchema.parse(req.params);
	return githubService.getRepository(params.owner, params.repo);
}

export async function listBranches(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = repoSchema.parse(req.params);
	return githubService.listBranches(params.owner, params.repo);
}

export async function listBranchCommits(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = branchSchema.parse(req.params);
	return githubService.listCommits(params.owner, params.repo, params.branch);
}

export async function getCommit(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = commitSchema.parse(req.params);
	return githubService.getCommit(params.owner, params.repo, params.ref);
}

export async function listPullRequests(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = repoSchema.parse(req.params);
	return githubService.listPullRequests(params.owner, params.repo);
}

export async function listPullRequestCommits(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = pullRequestSchema.parse(req.params);
	return githubService.listPullRequestCommits(
		params.owner,
		params.repo,
		params.pull_number,
	);
}

export async function listOrgRepos(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = orgSchema.parse(req.params);
	const query = pageSchema.parse(req.query);
	return githubService.listOrgRepos(params.org, query.page, query.per_page);
}

export async function listUserRepos(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const params = usernameSchema.parse(req.params);
	const query = pageSchema.parse(req.query);
	return githubService.listUserRepos(
		params.username,
		query.page,
		query.per_page,
	);
}

export async function searchRepositories(
	req: Request,
	_res: Response,
	_next: NextFunction,
) {
	const schema = z.object({
		...querySchema.shape,
		...pageSchema.shape,
	});
	const query = schema.parse(req.query);
	return githubService.searchRepositories(query.q, query.page, query.per_page);
}
