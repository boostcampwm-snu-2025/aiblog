import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

import type { PostGenerateRequest } from "../../types/githubPostData";
import type { PromptLang, PromptTone } from "../../types/promptSettings";

import LanguageSelectBox from "../SelectBox/LanguageSelectBox";
import ToneSelectBox from "../SelectBox/ToneSelectBox";

import { fetchMyPublicRepos } from "../../utils/api/githubRepo";
import { fetchRepoBranches } from "../../utils/api/githubBranch";
import { fetchRecentCommits } from "../../utils/api/githubCommit";
import { fetchMyPullRequests } from "../../utils/api/githubPR";

interface PostFormProps {
	onSubmit: (data: PostGenerateRequest) => void;
	loading: boolean;
}

type RepoLite = { full_name: string; default_branch?: string };

const postFormStyles: Record<string, CSSProperties> = {
	wrap: {
		display: "grid",
		gap: 14,
		padding: 16,
		border: "1px solid var(--pink-200)",
		borderRadius: 12,
		background: "var(--white)",
	},
	row: { display: "grid", gap: 6 },
	label: { fontWeight: 700, color: "var(--gray-800)" },
	select: {
		border: "1px solid var(--gray-300)",
		borderRadius: 8,
		padding: "8px 12px",
		background: "var(--white)",
	},
	selectBoxes: { display: "flex", gap: 20, marginTop: 20 },
	btn: { marginTop: 12 },
	hint: { fontSize: 13, color: "var(--gray-600)" },
};

const PostForm = ({ onSubmit, loading }: PostFormProps) => {
	const [repos, setRepos] = useState<RepoLite[]>([]);
	const [selectedRepo, setSelectedRepo] = useState<string>(
		"boostcampwm-snu-2025/aiblog"
	);

	const [branches, setBranches] = useState<{ name: string }[]>([]);
	const [selectedBranch, setSelectedBranch] = useState<string>("");

	const [commits, setCommits] = useState<{ id: string; title: string }[]>([]);
	const [prs, setPrs] = useState<{ id: string | number; title: string }[]>([]);

	const [selectedCommit, setSelectedCommit] = useState<string>("");
	const [selectedPR, setSelectedPR] = useState<string>("");

	const [lang, setLang] = useState<PromptLang>("ko");
	const [tone, setTone] = useState<PromptTone>("concise");

	useEffect(() => {
		(async () => {
			try {
				const res = await fetchMyPublicRepos();
				const items: RepoLite[] = (res.items || []).map((r: any) => ({
					full_name: r.full_name,
					default_branch: r.default_branch,
				}));
				setRepos(items);
				const found = items.find((repo) => repo.full_name === selectedRepo);
				if (found?.default_branch && !selectedBranch) {
					setSelectedBranch(found.default_branch);
				}
			} catch (e) {
				console.error("Failed to fetch repos:", e);
			}
		})();
	}, []);

	useEffect(() => {
		if (!selectedRepo) return;

		(async () => {
			try {
				// Reset choices
				setSelectedCommit("");
				setSelectedPR("");
				setCommits([]);
				setPrs([]);
				setBranches([]);

				// Branch list
				const branchRes = await fetchRepoBranches({
					repoFullName: selectedRepo,
				});
				const list = branchRes.items || [];
				setBranches(list);

				const defaultBranch =
					repos.find((repo) => repo.full_name === selectedRepo)
						?.default_branch ||
					list[0]?.name ||
					"";
				setSelectedBranch(defaultBranch);

				// PR is not related to branch- fetch all PRs
				const prsRes = await fetchMyPullRequests({
					repoFullName: selectedRepo,
					state: "all",
				});
				setPrs(
					(prsRes.items || []).map((pr: any) => ({
						id: typeof pr.id === "string" ? pr.id : Number(pr.id),
						title: pr.title || pr.body || `PR #${pr.number ?? pr.id}`,
					}))
				);
			} catch (e) {
				console.error("Failed on repo change:", e);
			}
		})();
	}, [selectedRepo, repos]);

	// Only load the commits of the selected branch
	useEffect(() => {
		if (!selectedRepo || !selectedBranch) return;

		(async () => {
			try {
				setSelectedCommit("");
				setCommits([]);

				const commitsRes = await fetchRecentCommits(
					selectedRepo,
					30,
					selectedBranch
				);
				setCommits(commitsRes.items || []);
			} catch (e) {
				console.error("Failed to fetch commits:", e);
			}
		})();
	}, [selectedRepo, selectedBranch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const data: PostGenerateRequest = {
			repo: selectedRepo,
			commits: selectedCommit ? [selectedCommit] : [],
			prs: selectedPR ? [Number(selectedPR)] : [],
			lang,
			tone,
		};
		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit} style={postFormStyles.wrap}>
			<div style={postFormStyles.row}>
				<label style={postFormStyles.label}>Select Repository</label>
				<select
					style={postFormStyles.select}
					value={selectedRepo}
					onChange={(e) => setSelectedRepo(e.target.value)}
				>
					{repos.map((repo) => (
						<option key={repo.full_name} value={repo.full_name}>
							{repo.full_name}
						</option>
					))}
				</select>
				<span style={postFormStyles.hint}>
					기본 브랜치:{" "}
					{repos.find((r) => r.full_name === selectedRepo)?.default_branch ??
						"-"}
				</span>
			</div>

			{/* Branch (Only influences commits) */}
			<div style={postFormStyles.row}>
				<label style={postFormStyles.label}>Select Branch</label>
				<select
					style={postFormStyles.select}
					value={selectedBranch}
					onChange={(e) => setSelectedBranch(e.target.value)}
					disabled={!branches.length}
				>
					{!branches.length && <option value="">No branches available</option>}
					{branches.map((branch) => (
						<option key={branch.name} value={branch.name}>
							{branch.name}
						</option>
					))}
				</select>
			</div>

			{/* Commit (Influenced by selected branch) */}
			<div style={postFormStyles.row}>
				<label style={postFormStyles.label}>Select Commit</label>
				<select
					style={postFormStyles.select}
					value={selectedCommit}
					onChange={(e) => setSelectedCommit(e.target.value)}
					disabled={!commits.length}
				>
					<option value="">
						{commits.length ? "-- Choose commit --" : "No commits available"}
					</option>
					{commits.map((commit) => (
						<option key={commit.id} value={commit.id}>
							{commit.title || commit.id}
						</option>
					))}
				</select>
			</div>

			{/* PR (All PRs from the repo) */}
			<div style={postFormStyles.row}>
				<label style={postFormStyles.label}>Select Pull Request</label>
				<select
					style={postFormStyles.select}
					value={selectedPR}
					onChange={(e) => setSelectedPR(e.target.value)}
					disabled={!prs.length}
				>
					<option value="">
						{prs.length ? "-- Choose PR --" : "No pull requests available"}
					</option>
					{prs.map((pr) => (
						<option key={pr.id} value={String(pr.id)}>
							{pr.title || `PR #${pr.id}`}
						</option>
					))}
				</select>
			</div>

			{/* Lang/Tone Selection */}
			<div style={postFormStyles.selectBoxes}>
				<LanguageSelectBox value={lang} onChange={setLang} />
				<ToneSelectBox value={tone} onChange={setTone} />
			</div>

			<button
				className="btn"
				type="submit"
				style={postFormStyles.btn}
				disabled={loading || !selectedRepo}
			>
				{loading ? "Generating..." : "Generate Post"}
			</button>
		</form>
	);
};

export default PostForm;
