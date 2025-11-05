import type { CSSProperties } from "react";
import type { CommitItem } from "../../types/githubCommitData";

interface CommitListProps {
	commits: CommitItem[];
}

const commitListStyles: {
	wrap: CSSProperties;
	item: CSSProperties;
	left: CSSProperties;
	avatar: CSSProperties;
	title: CSSProperties;
	metaRow: CSSProperties;
	metaChip: CSSProperties;
	body: CSSProperties;
	divider: CSSProperties;
	empty: CSSProperties;
} = {
	wrap: {
		display: "grid",
		gap: 10,
		padding: 12,
		border: "1px solid var(--pink-200)",
		borderRadius: 12,
		background:
			"color-mix(in srgb, var(--pink-500) 6%, white)" as unknown as string,
	},
	item: {
		display: "grid",
		gridTemplateColumns: "auto 1fr",
		gap: 10,
		padding: 10,
		borderRadius: 10,
		background: "var(--white)",
		border: "1px solid var(--gray-200)",
	},
	left: { display: "flex", alignItems: "flex-start" },
	avatar: {
		width: 28,
		height: 28,
		borderRadius: 8,
		border: "1px solid var(--gray-200)",
	},
	title: { margin: 0, fontWeight: 700, color: "var(--gray-900)" },
	metaRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 },
	metaChip: {
		fontSize: 12,
		padding: "3px 8px",
		borderRadius: 999,
		border: "1px solid var(--pink-300)",
		background:
			"color-mix(in srgb, var(--pink-300) 25%, white)" as unknown as string,
		color: "var(--pink-800)",
	},
	body: { margin: "6px 0 0", color: "var(--gray-700)", whiteSpace: "pre-wrap" },
	divider: { height: 1, background: "var(--gray-200)", margin: "2px 0" },
	empty: { padding: 8, color: "var(--gray-700)" },
};

const CommitList = ({ commits }: CommitListProps) => {
	if (!commits?.length) {
		return <div style={commitListStyles.empty}>최근 커밋이 없습니다.</div>;
	}
	return (
		<div style={commitListStyles.wrap}>
			Commits for this repository:
			{commits.map((commit, index) => (
				<div key={commit.id}>
					<div style={commitListStyles.item}>
						<div style={commitListStyles.left}>
							{commit.author?.avatar_url && (
								<img
									src={commit.author.avatar_url}
									alt={commit.author?.name || "author"}
									style={commitListStyles.avatar}
								/>
							)}
						</div>
						<div>
							<h4 style={commitListStyles.title}>
								<a
									href={commit.html_url}
									target="_blank"
									rel="noreferrer"
									style={{ color: "var(--pink-700)" }}
								>
									{commit.title}
								</a>
							</h4>
							<div style={commitListStyles.metaRow}>
								{commit.author?.name && (
									<span style={commitListStyles.metaChip}>
										{commit.author.name}
									</span>
								)}
								<span style={commitListStyles.metaChip}>
									{new Date(commit.time).toLocaleString()}
								</span>
								<span style={commitListStyles.metaChip}>commit</span>
							</div>
							{commit.body && (
								<p style={commitListStyles.body}>{commit.body}</p>
							)}
						</div>
					</div>
					{index < commits.length - 1 && (
						<div style={commitListStyles.divider} />
					)}
				</div>
			))}
		</div>
	);
};

export default CommitList;
