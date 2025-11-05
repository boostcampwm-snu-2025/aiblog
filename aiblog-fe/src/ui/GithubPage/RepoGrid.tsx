import type { CSSProperties } from "react";
import type { RepoItem } from "../../types/githubRepoData";
import RepoCard from "./RepoCard";

interface RepoGridProps {
	repos: RepoItem[];
}

const repoGridStyles: {
	empty: CSSProperties;
	grid: CSSProperties;
	title: CSSProperties;
} = {
	empty: {
		padding: 24,
		textAlign: "center",
		color: "var(--gray-700)",
	},
	grid: {
		display: "flex",
		flexDirection: "column",
		gap: 12,
		marginBottom: 20,
	},
	title: {
		padding: 12,
		fontWeight: 800,
		fontSize: 20,
		color: "var(--gray-800)",
	},
};

const RepoGrid = ({ repos }: RepoGridProps) => {
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
			{repos.map((r) => (
				<RepoCard key={r.id} repo={r} />
			))}
		</div>
	);
};

export default RepoGrid;
