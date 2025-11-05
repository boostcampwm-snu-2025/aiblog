import { useState } from "react";
import type { CSSProperties } from "react";

import type { RepoItem } from "../../types/githubRepoData";
import RepoCard from "./RepoCard";

import { fetchRecentCommits } from "../../utils/api/githubCommit";
import CommitList from "./CommitList";
import type { CommitItem } from "../../types/githubCommitData";

interface RepoGridProps {
	repos: RepoItem[];
}

const repoGridStyles: {
	empty: CSSProperties;
	grid: CSSProperties;
	title: CSSProperties;
	commitWrap: CSSProperties;
	commitLoading: CSSProperties;
	commitError: CSSProperties;
} = {
	empty: { padding: 24, textAlign: "center", color: "var(--gray-700)" },
	grid: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 },
	title: {
		padding: 12,
		fontWeight: 800,
		fontSize: 20,
		color: "var(--gray-800)",
	},
	commitWrap: { marginTop: 8 },
	commitLoading: { padding: 12, color: "var(--gray-700)" },
	commitError: {
		padding: 12,
		borderRadius: 10,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-800)",
	},
};

const RepoGrid = ({ repos }: RepoGridProps) => {
	const [openRepo, setOpenRepo] = useState<string | null>(null);
	const [commits, setCommits] = useState<Record<string, CommitItem[]>>({});
	const [loading, setLoading] = useState<Record<string, boolean>>({});
	const [errors, setErrors] = useState<Record<string, string | null>>({});

	const handleSelect = async (fullName: string) => {
		// toggle
		const nextOpen = openRepo === fullName ? null : fullName;
		setOpenRepo(nextOpen);
		if (nextOpen === null) return;

		// If already loaded: return
		if (commits[fullName]?.length) return;

		setLoading((s) => ({ ...s, [fullName]: true }));
		setErrors((s) => ({ ...s, [fullName]: null }));
		try {
			const res = await fetchRecentCommits(fullName, 20);
			setCommits((s) => ({ ...s, [fullName]: res.items ?? [] }));
		} catch (e: any) {
			setErrors((s) => ({
				...s,
				[fullName]: e?.message ?? "Failed to load commits",
			}));
		} finally {
			setLoading((s) => ({ ...s, [fullName]: false }));
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
				const isOpen = openRepo === r.full_name;
				const isLoading = !!loading[r.full_name];
				const err = errors[r.full_name];
				const list = commits[r.full_name] ?? [];

				return (
					<div key={r.id}>
						<RepoCard repo={r} onSelect={handleSelect} />

						{isOpen && (
							<div style={repoGridStyles.commitWrap}>
								{isLoading && (
									<div style={repoGridStyles.commitLoading}>
										Loading Commits...
									</div>
								)}
								{err && (
									<div className="card" style={repoGridStyles.commitError}>
										{err}
									</div>
								)}
								{!isLoading && !err && <CommitList commits={list} />}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default RepoGrid;
