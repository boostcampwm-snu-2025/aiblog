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
	const response = await ai.models.generateContent({
		model: "gemini-2.5-pro",
		contents: prompt,
	});
	res.send(response.text);
});

export default router;
