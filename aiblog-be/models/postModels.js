export function validateGeneratePostBody(body) {
	const out = {
		repo: String(body.repo || "").trim(),
		commits: Array.isArray(body.commits) ? body.commits : [],
		prs: Array.isArray(body.prs) ? body.prs : [],
		lang: (body.lang || "ko").toString(),
		tone: (body.tone || "concise").toString(),
	};

	if (!out.repo || !out.repo.includes("/")) {
		const err = new Error('Invalid body: repo must be "owner/name"');
		err.status = 400;
		throw err;
	}

	// commits: string[] (sha)
	out.commits = out.commits
		.map((commit) => String(commit || "").trim())
		.filter((commit) => commit.length > 0);

	// prs: number[] (PR number)
	out.prs = out.prs
		.map((pr) => Number(pr))
		.filter((pr) => Number.isInteger(pr) && pr > 0);

	if (out.commits.length === 0 && out.prs.length === 0) {
		const err = new Error(
			"Invalid body: at least one commit SHA or PR number is required"
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

// Commit Normalization
export function normalizeCommitForPost(c) {
	const msg = String(c?.commit?.message || "");
	const [title, ...rest] = msg.split("\n");
	const body = rest.join("\n").trim();

	return {
		id: c?.sha,
		type: "commit",
		title: title || "(no message)",
		body: body || undefined,
		html_url: c?.html_url,
		author: {
			name: c?.commit?.author?.name || c?.author?.login || undefined,
			avatar_url: c?.author?.avatar_url || undefined,
		},
		time: c?.commit?.author?.date || c?.commit?.committer?.date || null,
		files_changed: c?.files?.length ?? undefined,
		stats: c?.stats
			? {
					additions: c.stats.additions,
					deletions: c.stats.deletions,
					total: c.stats.total,
			  }
			: undefined,
	};
}

// PR normalization
export function normalizePRForPost(pr) {
	return {
		id: pr?.number,
		type: "pr",
		title: pr?.title || "(no title)",
		body: pr?.body || undefined,
		html_url: pr?.html_url,
		author: {
			name: pr?.user?.login || undefined,
			avatar_url: pr?.user?.avatar_url || undefined,
		},
		state: pr?.state, // open | closed
		merged: !!pr?.merged_at,
		base: pr?.base?.ref,
		head: pr?.head?.ref,
		additions: pr?.additions ?? undefined,
		deletions: pr?.deletions ?? undefined,
		changed_files: pr?.changed_files ?? undefined,
		created_at: pr?.created_at,
		updated_at: pr?.updated_at,
		merged_at: pr?.merged_at || undefined,
	};
}

// Generate Prompt for OpenAI
export function buildPostPrompt({ repo, commits, prs, lang, tone }) {
	const lines = [];
	lines.push(`Language: ${lang}`);
	lines.push(`Tone: ${tone}`);
	lines.push(`Repository: ${repo.owner}/${repo.name}`);
	lines.push(
		`Task: Write a developer blog post in Markdown summarizing the selected work items (commits and/or PRs).`
	);
	lines.push(
		`Constraints: Be technically accurate, do not invent facts beyond provided data. Focus on motivation, changes, impact, and next steps.`
	);

	if (commits?.length) {
		lines.push(`\nCommits (${commits.length}):`);
		commits.forEach((commit, idx) => {
			lines.push(
				`- [${idx + 1}] ${commit.id} | ${commit.title} | ${
					commit.time || ""
				} | additions=${commit.stats?.additions || 0}, deletions=${
					commit.stats?.deletions || 0
				}`
			);
			if (commit.body) lines.push(`  body: ${truncate(commit.body, 600)}`);
		});
	}

	if (prs?.length) {
		lines.push(`\nPull Requests (${prs.length}):`);
		prs.forEach((pr, idx) => {
			lines.push(
				`- [${idx + 1}] #${pr.id} | ${pr.title} | state=${pr.state} merged=${
					pr.merged
				} | base=${pr.base} <- head=${pr.head} | +${pr.additions || 0}/-${
					pr.deletions || 0
				}, files=${pr.changed_files || 0}`
			);
			if (pr.body) lines.push(`  body: ${truncate(pr.body, 800)}`);
		});
	}

	if (lang === "ko") {
		lines.push(`
			OUTPUT:
			- Markdown only.
			- 시작은 "# 제목" 한 줄.
			- 이어서 문제의식/맥락 → 변경사항(핵심 코드/설계 포인트 요약) → 영향/검증(벤치/테스트) → 회고/다음 과제 순.
			- 과장/허구 금지. 구체성과 간결함 사이 밸런스 유지.
			- 리스트/코드블록을 적절히 사용.
		`);
	} else {
		lines.push(`
			OUTPUT:
			- Markdown only.
			- Start with "# Title".
			- Then: context/motivation → core changes (design/code highlights) → impact/validation → reflection/next steps.
			- No fabrication. Keep concise and specific. Use lists/code blocks when helpful.
		`);
	}

	return lines.join("\n");
}

function truncate(s, n) {
	if (!s) return s;
	return s.length > n ? s.slice(0, n) + " ..." : s;
}
