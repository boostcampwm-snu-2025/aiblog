import { ai } from "../config/clients.js";
import { generateChangelogPrompt } from "../utils/prompts.js";

export async function generateCommitSummary(
	commitMessage: string,
	fileDiffs: {
		filename: string;
		patch?: string;
	}[],
): Promise<string> {
	const prompt = generateChangelogPrompt(commitMessage, fileDiffs);

	const response = await ai.models.generateContent({
		model: "gemini-2.5-pro",
		contents: prompt,
	});

	return response.text || "";
}
