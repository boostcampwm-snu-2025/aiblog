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
type CommitLite = { id: string; title: string };

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

	checklistWrap: {
		display: "grid",
		gap: 8,
		maxHeight: 280,
		overflow: "auto",
		border: "1px solid var(--gray-200)",
		borderRadius: 10,
		padding: 10,
		background: "var(--gray-50)",
	},
	checklistHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	checklistToolbar: { display: "flex", gap: 8, alignItems: "center" },
	pillBtn: {
		padding: "4px 10px",
		fontSize: 12,
		borderRadius: 999,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-700)",
		cursor: "pointer",
	},
	commitItemRow: {
		display: "grid",
		gridTemplateColumns: "auto 1fr",
		gap: 10,
		alignItems: "start",
		background: "var(--white)",
		border: "1px solid var(--gray-200)",
		borderRadius: 8,
		padding: 8,
	},
	commitTitle: {
		margin: 0,
		fontWeight: 600,
		color: "var(--gray-900)",
		wordBreak: "break-word",
	},
	commitMeta: { fontSize: 12, color: "var(--gray-700)" },
};

const PostForm = ({ onSubmit, loading }: PostFormProps) => {
	const [repos, setRepos] = useState<RepoLite[]>([]);
	const [selectedRepo, setSelectedRepo] = useState<string>(
		"boostcampwm-snu-2025/aiblog"
	);

	const [branches, setBranches] = useState<{ name: string }[]>([]);
	const [selectedBranch, setSelectedBranch] = useState<string>("");

	const [commits, setCommits] = useState<CommitLite[]>([]);
	const [selectedCommits, setSelectedCommits] = useState<string[]>([]); // Selecting multiple commits are allowed
	const [prs, setPrs] = useState<{ id: string | number; title: string }[]>([]);
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
				setSelectedBranch("");
				setCommits([]);
				setSelectedCommits([]);
				setPrs([]);
				setSelectedPR("");
				setBranches([]);

				const branchRes = await fetchRepoBranches({
					repoFullName: selectedRepo,
				});
				const list = branchRes.items || [];
				setBranches(list);

				const repoDefaultBranch =
					repos.find((repo) => repo.full_name === selectedRepo)
						?.default_branch || "";
				const availableDefaultBranch =
					list.find((branch: any) => branch.name === repoDefaultBranch)?.name ||
					"";
				const defaultBranch = availableDefaultBranch || list[0]?.name || "";
				setSelectedBranch(defaultBranch);

				// PR is not related to branch- fetch all PRs
				const prsRes = await fetchMyPullRequests({
					repoFullName: selectedRepo,
					state: "all",
				});
				setPrs(
					(prsRes.items || []).map((pr: any) => ({
						id: pr.number,
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
				setCommits([]);
				setSelectedCommits([]);

				const commitsRes = await fetchRecentCommits(
					selectedRepo,
					30,
					selectedBranch
				);
				const items: CommitLite[] = (commitsRes.items || []).map(
					(commit: any) => ({
						id: commit.id,
						title: commit.title || commit.id,
					})
				);
				setCommits(items);
			} catch (e) {
				console.error("Failed to fetch commits:", e);
			}
		})();
	}, [selectedRepo, selectedBranch]);

	// Toggle checkbox
	const toggleCommit = (sha: string) => {
		setSelectedCommits((prev) =>
			prev.includes(sha) ? prev.filter((x) => x !== sha) : [...prev, sha]
		);
	};

	const selectAllCommits = () => {
		setSelectedCommits(commits.map((commit) => commit.id));
	};

	const clearAllCommits = () => {
		setSelectedCommits([]);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const data: PostGenerateRequest = {
			repo: selectedRepo,
			commits: selectedCommits, // Multiple commits
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

			{/* Commit (Influenced by selected branch, multi select is allowed) */}
			<div style={postFormStyles.row}>
				<div style={postFormStyles.checklistHeader}>
					<label style={postFormStyles.label}>
						Select Commits ({selectedCommits.length} / {commits.length})
					</label>
					<div style={postFormStyles.checklistToolbar}>
						<button
							type="button"
							style={postFormStyles.pillBtn}
							onClick={selectAllCommits}
							disabled={!commits.length}
						>
							Select All
						</button>
						<button
							type="button"
							style={postFormStyles.pillBtn}
							onClick={clearAllCommits}
							disabled={!selectedCommits.length}
						>
							Clear
						</button>
					</div>
				</div>

				<div style={postFormStyles.checklistWrap} aria-live="polite">
					{!commits.length ? (
						<div style={{ color: "var(--gray-700)" }}>No commits available</div>
					) : (
						commits.map((commit) => (
							<label key={commit.id} style={postFormStyles.commitItemRow}>
								<input
									type="checkbox"
									checked={selectedCommits.includes(commit.id)}
									onChange={() => toggleCommit(commit.id)}
									aria-label={`select commit ${commit.id}`}
								/>
								<div>
									<p style={postFormStyles.commitTitle}>{commit.title}</p>
									{/* <div style={postFormStyles.commitMeta}>
										{commit.id?.slice(0, 7) ?? ""}
									</div> */}
								</div>
							</label>
						))
					)}
				</div>
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
