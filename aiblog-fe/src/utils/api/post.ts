import { POST_GENERATE_API } from "../../constants/api";
import type {
	PostGenerateRequest,
	PostGenerateResponse,
} from "../../types/githubPostData";

export async function generatePost(
	data: PostGenerateRequest
): Promise<PostGenerateResponse> {
	const token = import.meta.env.VITE_GITHUB_TOKEN;
	if (!token || token.trim() === "") {
		throw new Error("Missing GitHub token. Set VITE_GITHUB_TOKEN in .env");
	}

	const res = await fetch(POST_GENERATE_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to generate post: ${res.status} ${text}`);
	}

	return (await res.json()) as PostGenerateResponse;
}
