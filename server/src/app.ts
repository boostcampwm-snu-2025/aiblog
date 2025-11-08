import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Octokit } from "octokit";
import z from "zod";

dotenv.config();

const env = z
	.object({
		PORT: z.string().default("3001"),
		GITHUB_TOKEN: z.string(),
	})
	.parse(process.env);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));
app.use(cors());
app.use(express.json());

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

const schema = z.object({
	owner: z.string(),
	repo: z.string(),
	pull_number: z.coerce.number().min(1),
});
app.get(
	"/api/repos/:owner/:repo/pulls/:pull_number/commits",
	async (req, res) => {
		const params = schema.parse(req.params);

		const { data } = await octokit.rest.pulls.listCommits(params);
		res.json(data);
	},
);

app.listen(env.PORT, () => {
	console.log(` Server on http://localhost:${env.PORT}`);
});
