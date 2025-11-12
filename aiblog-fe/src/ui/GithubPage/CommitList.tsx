import { useState } from "react";
import type { CSSProperties } from "react";
import type { CommitItem } from "../../types/githubCommitData";

interface CommitListProps {
	commits: CommitItem[];
}

const commitListStyles: {
	wrap: CSSProperties;
	headerRow: CSSProperties;
	headerTitle: CSSProperties;
	item: CSSProperties;
	left: CSSProperties;
	avatar: CSSProperties;
	title: CSSProperties;
	metaRow: CSSProperties;
	metaChip: CSSProperties;
	body: CSSProperties;
	divider: CSSProperties;
	empty: CSSProperties;
	paginationRow: CSSProperties;
	pageBtn: CSSProperties;
	pageInfo: CSSProperties;
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
	headerRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 4,
	},
	headerTitle: {
		margin: 0,
		fontWeight: 800,
		fontSize: 16,
		color: "var(--gray-900)",
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

	paginationRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
		paddingTop: 8,
		borderTop: "1px solid var(--gray-200)",
	},
	pageBtn: {
		padding: "6px 10px",
		fontSize: 14,
		borderRadius: 6,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-700)",
		cursor: "pointer",
		transition: "all 0.15s ease",
	},
	pageInfo: {
		fontSize: 13,
		color: "var(--gray-700)",
		fontWeight: 600,
	},
};

const CommitList = ({ commits }: CommitListProps) => {
	const [page, setPage] = useState(1);
	const perPage = 5;
	const totalPages = Math.max(1, Math.ceil((commits?.length ?? 0) / perPage));

	if (!commits?.length) {
		return <div style={commitListStyles.empty}>최근 커밋이 없습니다.</div>;
	}

	const start = (page - 1) * perPage;
	const current = commits.slice(start, start + perPage);

	const handlePrev = () => setPage((p) => Math.max(1, p - 1));
	const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

	return (
		<div style={commitListStyles.wrap}>
			<div style={commitListStyles.headerRow}>
				<h3 style={commitListStyles.headerTitle}>
					Recent 30 Commits for this repository
				</h3>
				<span style={commitListStyles.pageInfo}>
					{page} / {totalPages} 페이지
				</span>
			</div>

			{current.map((commit, index) => (
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
					{index < current.length - 1 && (
						<div style={commitListStyles.divider} />
					)}
				</div>
			))}

			{totalPages > 1 && (
				<div style={commitListStyles.paginationRow}>
					<button
						style={{
							...commitListStyles.pageBtn,
							opacity: page === 1 ? 0.4 : 1,
							pointerEvents: page === 1 ? "none" : "auto",
						}}
						onClick={handlePrev}
						aria-label="이전 페이지"
					>
						&lt; 이전
					</button>
					<button
						style={{
							...commitListStyles.pageBtn,
							opacity: page === totalPages ? 0.4 : 1,
							pointerEvents: page === totalPages ? "none" : "auto",
						}}
						onClick={handleNext}
						aria-label="다음 페이지"
					>
						다음 &gt;
					</button>
				</div>
			)}
		</div>
	);
};

export default CommitList;
