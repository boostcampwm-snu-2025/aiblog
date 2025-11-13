import type { CSSProperties } from "react";
import type { RepoItem } from "../../types/githubRepoData";

interface RepoCardProps {
	repo: RepoItem;
	onClickCommit?: (fullName: string) => void;
	onClickPR?: (fullName: string) => void;
}

const repoCardStyles: Record<string, CSSProperties> = {
	card: { padding: 16 },
	headerRow: {
		display: "flex",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: 12,
	},
	left: {
		display: "flex",
		alignItems: "center",
		gap: 12,
		minWidth: 0,
		flex: 1,
	},
	header: { display: "flex", alignItems: "center", gap: 12 },
	avatar: { borderRadius: 8, border: "1px solid var(--gray-200)" },
	link: { fontWeight: 700, color: "var(--pink-700)" },
	description: {
		margin: "6px 0 0",
		color: "var(--gray-700)",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	actions: { display: "flex", gap: 8 },
	actionBtn: {
		padding: "6px 10px",
		fontSize: 12,
		borderRadius: 8,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-700)",
		cursor: "pointer",
	},
	metaContainer: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
	metaItem: { padding: "4px 10px", fontSize: 12 },
};

const RepoCard = ({ repo, onClickCommit, onClickPR }: RepoCardProps) => {
	return (
		<article className="card" style={repoCardStyles.card}>
			<div style={repoCardStyles.headerRow}>
				<div style={repoCardStyles.left}>
					{repo.owner?.avatar_url && (
						<img
							src={repo.owner.avatar_url}
							alt={repo.owner.login || "owner"}
							width={32}
							height={32}
							style={repoCardStyles.avatar}
						/>
					)}
					<div style={{ minWidth: 0 }}>
						<a
							href={repo.html_url}
							target="_blank"
							rel="noreferrer"
							style={repoCardStyles.link}
							title={repo.full_name}
							onClick={(e) => e.stopPropagation()}
						>
							{repo.full_name}
						</a>
						{repo.description && (
							<p style={repoCardStyles.description}>{repo.description}</p>
						)}
					</div>
				</div>

				<div style={repoCardStyles.actions}>
					<button
						type="button"
						style={repoCardStyles.actionBtn}
						onClick={(e) => {
							e.stopPropagation();
							onClickCommit?.(repo.full_name);
						}}
					>
						Commits
					</button>
					<button
						type="button"
						style={repoCardStyles.actionBtn}
						onClick={(e) => {
							e.stopPropagation();
							onClickPR?.(repo.full_name);
						}}
					>
						PRs
					</button>
				</div>
			</div>

			<div style={repoCardStyles.metaContainer}>
				{repo.language && (
					<span className="btn ghost" style={repoCardStyles.metaItem}>
						{repo.language}
					</span>
				)}
				{repo.updated_at && (
					<span className="btn ghost" style={repoCardStyles.metaItem}>
						Updated: {new Date(repo.updated_at).toLocaleString()}
					</span>
				)}
				<a
					className="btn ghost"
					style={repoCardStyles.metaItem}
					href={repo.html_url}
					target="_blank"
					rel="noreferrer"
					onClick={(e) => e.stopPropagation()}
				>
					View on GitHub
				</a>
			</div>
		</article>
	);
};

export default RepoCard;
