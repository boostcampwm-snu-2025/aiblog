import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import RepoGrid from "./RepoGrid";
import type { RepoItem } from "../../types/githubRepoData";
import { fetchMyPublicRepos } from "../../utils/api/githubRepo";

const githubPageStyles: {
	wrap: CSSProperties;
	errorCard: CSSProperties;
	errorTitle: CSSProperties;
	errorMessage: CSSProperties;
	loadingMessage: CSSProperties;
} = {
	wrap: { display: "grid", gap: 16 },
	errorCard: {
		padding: 16,
		borderColor: "var(--pink-400)",
		background: "var(--pink-50)",
	},
	errorTitle: { color: "var(--pink-700)" },
	errorMessage: { marginTop: 8 },
	loadingMessage: { marginLeft: 16 },
};

const GithubPage = () => {
	const [repos, setRepos] = useState<RepoItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await fetchMyPublicRepos();
				if (!cancelled) setRepos(data.items ?? []);
			} catch (e: any) {
				if (!cancelled) setError(e?.message ?? "Unknown error");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div style={githubPageStyles.wrap}>
			{loading && (
				<div style={githubPageStyles.loadingMessage}>Loading ...</div>
			)}

			{error && (
				<div className="card" style={githubPageStyles.errorCard}>
					<strong style={githubPageStyles.errorTitle}>Error</strong>
					<p style={githubPageStyles.errorMessage}>{error}</p>
				</div>
			)}

			{!loading && !error && <RepoGrid repos={repos} />}
		</div>
	);
};

export default GithubPage;
