import type { CSSProperties } from "react";
import { useState } from "react";

import type { PostGenerateRequest } from "../../types/githubPostData";
import type { PromptLang, PromptTone } from "../../types/promptSettings";

interface PostFormProps {
	onSubmit: (data: PostGenerateRequest) => void;
	loading: boolean;
}

const formStyles: { [key: string]: CSSProperties } = {
	wrap: {
		display: "grid",
		gap: 12,
		padding: 16,
		border: "1px solid var(--pink-200)",
		borderRadius: 12,
		background: "var(--white)",
	},
	row: { display: "grid", gap: 6 },
	label: { fontWeight: 700, color: "var(--gray-800)" },
	input: {
		border: "1px solid var(--gray-300)",
		borderRadius: 8,
		padding: "8px 12px",
		outline: "none",
	},
	select: {
		border: "1px solid var(--gray-300)",
		borderRadius: 8,
		padding: "8px 12px",
	},
	btn: { marginTop: 10 },
};

const PostForm = ({ onSubmit, loading }: PostFormProps) => {
	const [repo, setRepo] = useState("kimheonningg/aiblog");
	const [commits, setCommits] = useState("");
	const [prs, setPrs] = useState("");
	const [lang, setLang] = useState<PromptLang>("ko");
	const [tone, setTone] = useState<PromptTone>("concise");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const commitList = commits
			.split(",")
			.map((x) => x.trim())
			.filter(Boolean);
		const prList = prs
			.split(",")
			.map((x) => Number(x.trim()))
			.filter((x) => !isNaN(x));
		onSubmit({ repo, commits: commitList, prs: prList, lang, tone });
	};

	return (
		<form onSubmit={handleSubmit} style={formStyles.wrap}>
			<div style={formStyles.row}>
				<label style={formStyles.label}>Repository (owner/name)</label>
				<input
					style={formStyles.input}
					value={repo}
					onChange={(e) => setRepo(e.target.value)}
				/>
			</div>
			<div style={formStyles.row}>
				<label style={formStyles.label}>Commit SHAs (comma separated)</label>
				<input
					style={formStyles.input}
					value={commits}
					onChange={(e) => setCommits(e.target.value)}
				/>
			</div>
			<div style={formStyles.row}>
				<label style={formStyles.label}>PR Numbers (comma separated)</label>
				<input
					style={formStyles.input}
					value={prs}
					onChange={(e) => setPrs(e.target.value)}
				/>
			</div>

			<div style={{ display: "flex", gap: 8 }}>
				<select
					value={lang}
					onChange={(e) => setLang(e.target.value as any)}
					style={formStyles.select}
				>
					<option value="ko">Korean</option>
					<option value="en">English</option>
				</select>
				<select
					value={tone}
					onChange={(e) => setTone(e.target.value as any)}
					style={formStyles.select}
				>
					<option value="concise">Concise</option>
					<option value="friendly">Friendly</option>
					<option value="formal">Formal</option>
				</select>
			</div>

			<button
				className="btn"
				type="submit"
				style={formStyles.btn}
				disabled={loading}
			>
				{loading ? "Generating..." : "Generate Post"}
			</button>
		</form>
	);
};

export default PostForm;
