import { Octokit } from "@octokit/rest";

export function makeOctokit(token) {
	if (!token) {
		const err = new Error("GitHub token is required");
		err.status = 401;
		throw err;
	}
	return new Octokit({
		auth: token, // Octokit이 내부적으로 Authorization: Bearer <token>을 구성함
		userAgent: "smartblog/0.1.0",
		request: { timeout: 10_000 },
	});
}
