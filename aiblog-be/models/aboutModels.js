export function validateAboutQuery(query) {
	const out = {
		github: query.github ? String(query.github).trim() : undefined,
		lang: (query.lang || "ko").toString(), // "ko" | "en"
		tone: (query.tone || "concise").toString(), // "concise" | "friendly" | "formal"
	};

	if (!out.github) {
		const err = new Error(
			'Invalid query: "github" is required (e.g., https://github.com/<username>)'
		);
		err.status = 400;
		throw err;
	}

	const allowedLang = new Set(["ko", "en"]);
	if (!allowedLang.has(out.lang)) out.lang = "ko";

	const allowedTone = new Set(["concise", "friendly", "formal"]);
	if (!allowedTone.has(out.tone)) out.tone = "concise";

	return out;
}

export function normalizeGithubProfile(github) {
	return {
		login: github?.login,
		name: github?.name || undefined,
		bio: github?.bio || undefined,
		company: github?.company || undefined,
		blog: github?.blog || undefined,
		location: github?.location || undefined,
		followers: github?.followers ?? 0,
		following: github?.following ?? 0,
		public_repos: github?.public_repos ?? 0,
		html_url: github?.html_url,
		avatar_url: github?.avatar_url,
	};
}

export function buildAboutPrompt({ github, lang, tone }) {
	const lines = [];
	lines.push(`Language: ${lang}`);
	lines.push(`Tone: ${tone}`);
	lines.push(
		`Write a first-person "About me" paragraph based ONLY on the GitHub profile below.`
	);

	lines.push(
		`GitHub profile:
			login=${github.login || ""}
			name=${github.name || ""}
			bio=${github.bio || ""}
			company=${github.company || ""}
			blog=${github.blog || ""}
			location=${github.location || ""}
			public_repos=${github.public_repos}
			followers=${github.followers}
			url=${github.html_url}
		`
	);

	lines.push(
		`
			Do not fabricate employers, degrees, or achievements not implied by the GitHub data. 
			Use public data only. Do not use too personal data.
			Summarize strengths, interests, typical work, and areas of focus.
		`
	);

	if (lang === "ko") {
		lines.push(
			`
				한국어로 4~6문장, 1인칭(예: "저는 ...")으로 자연스럽게 작성하세요. 
				과장 표현을 피하고 간결히. 
				이름은 영어 그대로 표현하세요.
			`
		);
	} else {
		lines.push(
			`
				Write 120–180 words in natural first-person English. 
				Avoid exaggeration; keep it concise and professional.
			`
		);
	}

	return lines.join("\n");
}
