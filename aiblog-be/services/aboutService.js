import { fetchGithubProfileRepo } from "../repositories/aboutRepository.js";
import {
	buildAboutPrompt,
	normalizeGithubProfile,
} from "../models/aboutModels.js";
import { chatComplete } from "../utils/openai.js";

export async function getGeneratedAboutService(params) {
	const { token, github, lang, tone } = params;

	const gh = await fetchGithubProfileRepo({ token, github_url: github });
	const ghNormalized = normalizeGithubProfile(gh);

	const prompt = buildAboutPrompt({ github: ghNormalized, lang, tone });

	const about = await chatComplete({
		system:
			"You are a helpful assistant that writes concise, first-person developer bios based solely on provided GitHub profile data.",
		user: prompt,
	});

	return {
		about,
		sources: {
			github: ghNormalized,
		},
	};
}
