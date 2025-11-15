import { Router } from "express";
import { Octokit } from "octokit";
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

router.get("/repos/:owner/:repo", async (req, res) => {
	const params = repoSchema.parse(req.params);
	const { data } = await octokit.rest.repos.get(params);
	res.json(data);
});

router.get("/repos/:owner/:repo/branches", async (req, res) => {
	const params = repoSchema.parse(req.params);
	const { data } = await octokit.rest.repos.listBranches(params);
	res.json(data);
});

router.get("/repos/:owner/:repo/branches/:branch/commits", async (req, res) => {
	const params = branchSchema.parse(req.params);
	const { data } = await octokit.rest.repos.listCommits({
		owner: params.owner,
		repo: params.repo,
		sha: params.branch,
	});
	res.json(data);
});

router.get("/repos/:owner/:repo/commits/:ref", async (req, res) => {
	const params = commitSchema.parse(req.params);
	const { data } = await octokit.rest.repos.getCommit(params);
	res.json(data);
});

router.get("/repos/:owner/:repo/pulls", async (req, res) => {
	const params = repoSchema.parse(req.params);
	const { data } = await octokit.rest.pulls.list(params);
	res.json(data);
});

router.get(
	"/repos/:owner/:repo/pulls/:pull_number/commits",
	async (req, res) => {
		const params = pullRequestSchema.parse(req.params);
		const { data } = await octokit.rest.pulls.listCommits(params);
		res.json(data);
	},
);

export default router;
