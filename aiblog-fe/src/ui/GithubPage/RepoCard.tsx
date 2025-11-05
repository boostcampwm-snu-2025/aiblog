import type { CSSProperties } from "react";
import type { RepoItem } from "../../types/githubRepoData";
interface RepoCardProps {
	repo: RepoItem;
	onSelect?: (fullName: string) => void;
}

const repoCardStyles: {
	card: CSSProperties;
	header: CSSProperties;
	avatar: CSSProperties;
	link: CSSProperties;
	description: CSSProperties;
	metaContainer: CSSProperties;
	metaItem: CSSProperties;
	clickable: CSSProperties;
} = {
	card: { padding: 16 },
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
	metaContainer: { display: "flex", gap: 8, marginTop: 12 },
	metaItem: { padding: "4px 10px", fontSize: 12 },
	clickable: { cursor: "pointer", transition: "box-shadow .12s ease" },
};

const RepoCard = ({ repo, onSelect }: RepoCardProps) => {
	return (
		<article
			className="card"
			style={{
				...repoCardStyles.card,
				...(onSelect ? repoCardStyles.clickable : {}),
			}}
			onClick={() => onSelect?.(repo.full_name)}
			role={onSelect ? "button" : undefined}
			tabIndex={onSelect ? 0 : undefined}
			onKeyDown={(e) => {
				if (!onSelect) return;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(repo.full_name);
				}
			}}
		>
			<div style={repoCardStyles.header}>
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
