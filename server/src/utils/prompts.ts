export function generateChangelogPrompt(
	commitMessage: string,
	fileDiffs: {
		filename: string;
		patch?: string;
	}[],
): string {
	const filesWithDiffs = fileDiffs
		.map(
			(file) =>
				`File: ${file.filename}\n${file.patch || "Binary file or no diff available"}`,
		)
		.join("\n\n");

	return `Generate a concise summary of the following commit for a changelog.

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
}
