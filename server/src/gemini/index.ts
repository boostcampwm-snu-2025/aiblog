import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
import { Octokit } from "octokit";
import z from "zod";
import env from "../env.js";

const router: Router = Router();

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

router.get("/summary/:owner/:repo/commits/:ref", async (req, res) => {
	const schema = z.object({
			owner: z.string(),
			repo: z.string(),
			ref: z.string(),
		});
	const params = schema.parse(req.params);
	const commitResponse = await octokit.rest.repos.getCommit(params);
	const commitMessage = commitResponse.data.commit.message;
	const diffs = commitResponse.data.files?.map(file => file.patch).join("\n") || "";
	const prompt = `Generate a concise summary of the following commit for a changelog.\n\nCommit Message:\n${commitMessage}\n\nDiffs:\n${diffs}\n\nChangelog Entry:`;
	const response = await ai.models.generateContent({
		model: "gemini-2.5-pro",
		contents: prompt,
	});
	res.send(response.text);
});

export default router;
