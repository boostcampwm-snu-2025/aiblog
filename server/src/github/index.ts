import { Router } from "express";
import { Octokit } from "octokit";
import z from "zod";
import env from "../env.js";

const router: Router = Router();

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

router.get(
	"/repos/:owner/:repo/pulls/:pull_number/commits",
	async (req, res) => {
		const schema = z.object({
			owner: z.string(),
			repo: z.string(),
			pull_number: z.coerce.number().min(1),
		});
		const params = schema.parse(req.params);
		const { data } = await octokit.rest.pulls.listCommits(params);
		res.json(data);
	},
);

export default router;
