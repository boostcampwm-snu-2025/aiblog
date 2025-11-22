import fs from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
import { Octokit } from "octokit";
import env from "../env.js";
import { summarySchema } from "./schema.js";

const router: Router = Router();

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

const DATA_PATH = "data";
function getFilePath(owner: string, repo: string, ref: string) {
	return `${DATA_PATH}/${owner}/${repo}/${ref}.txt`;
}

router.get("/summary/:owner/:repo/commits/:ref", async (req, res) => {
	const params = summarySchema.parse(req.params);
	const data = await fs.readFile(
		getFilePath(params.owner, params.repo, params.ref),
		{ encoding: "utf-8" },
	);
	res.status(200).send(data);
});

router.post("/summary/:owner/:repo/commits/:ref", async (req, res) => {
	const params = summarySchema.parse(req.params);

	const exists = await fs
		.access(
			getFilePath(params.owner, params.repo, params.ref),
			fs.constants.F_OK,
		)
		.then(() => true)
		.catch(() => false);
	if (exists) {
		res.status(409).json({ message: "Summary already exists" });
		return;
	}

	const commitResponse = await octokit.rest.repos.getCommit(params);
	const commitMessage = commitResponse.data.commit.message;
	const filesWithDiffs =
		commitResponse.data.files
			?.map(
				(file) =>
					`File: ${file.filename}\n${file.patch || "Binary file or no diff available"}`,
			)
			.join("\n\n") || "";
	const prompt = `Generate a concise summary of the following commit for a changelog.

Commit Message:
${commitMessage}

Changed Files and Diffs:
${filesWithDiffs}

Please generate a changelog entry in the following format:
- Use clear, user-friendly language
- Start with a category (feat/fix/chore/docs/refactor/test/style)
- Briefly describe what changed and why it matters to users
- Keep it concise (1-2 sentences)
- If necessary, add a short review comment highlighting important aspects (e.g., potential breaking changes, security improvements, performance impact, or areas needing attention)
- Example: "feat: Add user authentication with OAuth2 support for Google and GitHub providers"

Changelog Entry:`;
	const { text = "" } = await ai.models.generateContent({
		model: "gemini-2.5-pro",
		contents: prompt,
	});

	await fs.writeFile(getFilePath(params.owner, params.repo, params.ref), text, {
		encoding: "utf-8",
	});
	res.status(201).send(text);
});

router.delete("/summary/:owner/:repo/commits/:ref", async (req, res) => {
	const params = summarySchema.parse(req.params);

	const deleted = await fs
		.rm(getFilePath(params.owner, params.repo, params.ref))
		.then(() => true)
		.catch(() => false);
	if (!deleted) {
		res.status(404).json({ message: "Summary not found" });
		return;
	}
	res.status(204).send();
});

export default router;
