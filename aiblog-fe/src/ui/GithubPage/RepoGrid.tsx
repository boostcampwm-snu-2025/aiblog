import { useState } from "react";
import type { CSSProperties } from "react";

import type { RepoItem } from "../../types/githubRepoData";
import RepoCard from "./RepoCard";

import { fetchRecentCommits } from "../../utils/api/githubCommit";
import CommitList from "./CommitList";
import type { CommitItem } from "../../types/githubCommitData";

import { fetchMyPullRequests } from "../../utils/api/githubPR";
import PRList from "./PRList";
import type { PRItem } from "../../types/githubPRData";
interface RepoGridProps {
	repos: RepoItem[];
}

const repoGridStyles: Record<string, CSSProperties> = {
	empty: { padding: 24, textAlign: "center", color: "var(--gray-700)" },
	grid: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 },
	title: {
		padding: 12,
		fontWeight: 800,
		fontSize: 20,
		color: "var(--gray-800)",
	},
	panelWrap: { marginTop: 8 },
	loading: { padding: 12, color: "var(--gray-700)" },
	error: {
		padding: 12,
		borderRadius: 10,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-800)",
	},
};

const RepoGrid = ({ repos }: RepoGridProps) => {
	// commit panel states
	const [openCommitRepo, setOpenCommitRepo] = useState<string | null>(null);
	const [commits, setCommits] = useState<Record<string, CommitItem[]>>({});
	const [commitLoading, setCommitLoading] = useState<Record<string, boolean>>(
		{}
	);
	const [commitErrors, setCommitErrors] = useState<
		Record<string, string | null>
	>({});

	// PR panel states
	const [openPrRepo, setOpenPrRepo] = useState<string | null>(null);
	const [prs, setPrs] = useState<Record<string, PRItem[]>>({});
	const [prLoading, setPrLoading] = useState<Record<string, boolean>>({});
	const [prErrors, setPrErrors] = useState<Record<string, string | null>>({});

	const handleClickCommit = async (fullName: string) => {
		// toggle commit panel, close PR panel
		const next = openCommitRepo === fullName ? null : fullName;
		setOpenCommitRepo(next);
		setOpenPrRepo(null);

		if (next === null) return;
		if (commits[fullName]?.length) return;

		setCommitLoading((s) => ({ ...s, [fullName]: true }));
		setCommitErrors((s) => ({ ...s, [fullName]: null }));
		try {
			const res = await fetchRecentCommits(fullName, 20);
			setCommits((s) => ({ ...s, [fullName]: res.items ?? [] }));
		} catch (e: any) {
			setCommitErrors((s) => ({
				...s,
				[fullName]: e?.message ?? "Failed to load commits",
			}));
		} finally {
			setCommitLoading((s) => ({ ...s, [fullName]: false }));
		}
	};

	const handleClickPR = async (fullName: string) => {
		// toggle PR panel, close commit panel
		const next = openPrRepo === fullName ? null : fullName;
		setOpenPrRepo(next);
		setOpenCommitRepo(null);

		if (next === null) return;
		if (prs[fullName]?.length) return;

		setPrLoading((s) => ({ ...s, [fullName]: true }));
		setPrErrors((s) => ({ ...s, [fullName]: null }));
		try {
			const res = await fetchMyPullRequests({
				repoFullName: fullName,
				state: "all",
				per_page: 30,
				page: 1,
			});
			setPrs((s) => ({ ...s, [fullName]: res.items ?? [] }));
		} catch (e: any) {
			setPrErrors((s) => ({
				...s,
				[fullName]: e?.message ?? "Failed to load PRs",
			}));
		} finally {
			setPrLoading((s) => ({ ...s, [fullName]: false }));
		}
	};

	if (!repos?.length) {
		return (
			<div className="card" style={repoGridStyles.empty}>
				공개 레포지토리가 없습니다.
			</div>
		);
	}

	return (
		<div style={repoGridStyles.grid}>
			<div style={repoGridStyles.title}>My Github Public Repositories:</div>

			{repos.map((r) => {
				const commitOpen = openCommitRepo === r.full_name;
				const prOpen = openPrRepo === r.full_name;

				return (
					<div key={r.id}>
						<RepoCard
							repo={r}
							onClickCommit={handleClickCommit}
							onClickPR={handleClickPR}
						/>

						{/* Commit Panel */}
						{commitOpen && (
							<div style={repoGridStyles.panelWrap}>
								{commitLoading[r.full_name] && (
									<div style={repoGridStyles.loading}>커밋 불러오는 중...</div>
								)}
								{commitErrors[r.full_name] && (
									<div className="card" style={repoGridStyles.error}>
										{commitErrors[r.full_name]}
									</div>
								)}
								{!commitLoading[r.full_name] && !commitErrors[r.full_name] && (
									<CommitList commits={commits[r.full_name] ?? []} />
								)}
							</div>
						)}

						{/* PR Panel */}
						{prOpen && (
							<div style={repoGridStyles.panelWrap}>
								{prLoading[r.full_name] && (
									<div style={repoGridStyles.loading}>PR 불러오는 중...</div>
								)}
								{prErrors[r.full_name] && (
									<div className="card" style={repoGridStyles.error}>
										{prErrors[r.full_name]}
									</div>
								)}
								{!prLoading[r.full_name] && !prErrors[r.full_name] && (
									<PRList items={prs[r.full_name] ?? []} />
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default RepoGrid;
