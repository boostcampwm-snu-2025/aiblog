import { useState } from "react";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PRItem } from "../../types/githubPRData";
import { markdownBaseStyles, markdownComponents } from "../markdown";

interface PRListProps {
	items: PRItem[];
}

const prListStyles: Record<string, CSSProperties> = {
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
	body: { margin: "6px 0 0" },
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
	pageInfo: { fontSize: 13, color: "var(--gray-700)", fontWeight: 600 },
};

const PRList = ({ items }: PRListProps) => {
	const [page, setPage] = useState(1);
	const perPage = 1;
	const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / perPage));

	if (!items?.length) {
		return <div style={prListStyles.empty}>Pull Request가 없습니다.</div>;
	}

	const start = (page - 1) * perPage;
	const current = items.slice(start, start + perPage);

	return (
		<div style={prListStyles.wrap}>
			<div style={prListStyles.headerRow}>
				<h3 style={prListStyles.headerTitle}>
					Pull Requests for this repository{" "}
				</h3>
				<span style={prListStyles.pageInfo}>
					{page} / {totalPages} 페이지
				</span>
			</div>

			{current.map((pr, idx) => (
				<div key={pr.id}>
					<div style={prListStyles.item}>
						<div style={prListStyles.left}>
							{pr.author?.avatar_url && (
								<img
									src={pr.author.avatar_url}
									alt={pr.author?.name || "author"}
									style={prListStyles.avatar}
								/>
							)}
						</div>
						<div>
							<h4 style={prListStyles.title}>
								<a
									href={pr.html_url}
									target="_blank"
									rel="noreferrer"
									style={{ color: "var(--pink-700)" }}
								>
									#{pr.number} {pr.title}
								</a>
							</h4>
							<div style={prListStyles.metaRow}>
								{pr.author?.name && (
									<span style={prListStyles.metaChip}>{pr.author.name}</span>
								)}
								<span style={prListStyles.metaChip}>
									{new Date(pr.time || "").toLocaleString()}
								</span>
								<span style={prListStyles.metaChip}>{pr.state}</span>
								{typeof pr.is_merged === "boolean" && (
									<span style={prListStyles.metaChip}>
										{pr.is_merged ? "merged" : "not merged"}
									</span>
								)}
							</div>
							{pr.body && (
								<div style={{ ...prListStyles.body, ...markdownBaseStyles }}>
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={markdownComponents}
									>
										{pr.body}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>
					{idx < current.length - 1 && <div style={prListStyles.divider} />}
				</div>
			))}

			{totalPages > 1 && (
				<div style={prListStyles.paginationRow}>
					<button
						style={{
							...prListStyles.pageBtn,
							opacity: page === 1 ? 0.4 : 1,
							pointerEvents: page === 1 ? "none" : "auto",
						}}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						&lt; 이전
					</button>
					<button
						style={{
							...prListStyles.pageBtn,
							opacity: page === totalPages ? 0.4 : 1,
							pointerEvents: page === totalPages ? "none" : "auto",
						}}
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					>
						다음 &gt;
					</button>
				</div>
			)}
		</div>
	);
};

export default PRList;
