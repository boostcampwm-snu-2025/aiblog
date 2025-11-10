import { makeOctokit } from "../utils/octokit.js";
import { parseGithubUsernameFromUrl } from "../utils/githubUrl.js";

export async function fetchGithubProfileRepo({ token, github_url }) {
	const octokit = makeOctokit(token);
	const username = parseGithubUsernameFromUrl(github_url);
	if (!username) {
		const err = new Error(
			'Invalid github url: expected "https://github.com/<username>"'
		);
		err.status = 400;
		throw err;
	}
	const res = await octokit.users.getByUsername({ username });
	return res.data;
}
