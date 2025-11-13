import {
	assertRepoIsPublicRepo,
	getCommitByShaRepo,
	getPRByNumberRepo,
} from "../repositories/githubRepository.js";
import {
	buildPostPrompt,
	normalizeCommitForPost,
	normalizePRForPost,
} from "../models/postModels.js";
import { chatComplete } from "../utils/openai.js";

export async function generatePostService(params) {
	const { token, repo, commits = [], prs = [], lang, tone } = params;

	const [owner, name] = repo.split("/");
	await assertRepoIsPublicRepo({ token, owner, name }); // public repo only

	const commitObjs = [];
	for (const sha of commits) {
		const c = await getCommitByShaRepo({ token, owner, name, sha });
		commitObjs.push(c);
	}

	const prObjs = [];
	for (const num of prs) {
		const p = await getPRByNumberRepo({ token, owner, name, number: num });
		prObjs.push(p);
	}

	// Normalization
	const commitItems = commitObjs.map(normalizeCommitForPost);
	const prItems = prObjs.map(normalizePRForPost);

	// Make prompt for OpenAI
	const prompt = buildPostPrompt({
		repo: { owner, name },
		commits: commitItems,
		prs: prItems,
		lang,
		tone,
	});

	// Call OpenAI and generate markdown post
	const markdown = await chatComplete({
		system:
			"You are a senior developer who writes clear, technically accurate dev blog posts based only on the provided GitHub data. Do not invent facts.",
		user: prompt,
		model: "gpt-4o-mini",
		temperature: 0.4,
	});

	// Response
	return {
		post: {
			format: "markdown",
			content: markdown,
		},
		sources: {
			repo: `${owner}/${name}`,
			commits: commitItems,
			prs: prItems,
		},
	};
}
