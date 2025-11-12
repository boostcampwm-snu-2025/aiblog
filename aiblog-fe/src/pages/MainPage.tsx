import "../styles/global.css";
import { useEffect, useState } from "react";

import Header from "../ui/Header";
import type { HeaderTabType } from "../types/headerTab";

import RepoGrid from "../ui/GithubPage/RepoGrid";
import type { RepoItem } from "../types/githubRepoData";
import { fetchMyPublicRepos } from "../utils/api/githubRepo";

const mainPageStyles = {
	container: {
		display: "grid",
		gap: 16,
	},
	errorCard: {
		padding: 16,
		borderColor: "var(--pink-400)",
		background: "var(--pink-50)",
	},
	errorTitle: {
		color: "var(--pink-700)",
	},
	errorMessage: {
		marginTop: 8,
	},
	loadingMessage: {
		marginLeft: 16,
	},
};

const MainPage = () => {
	const [currentTab, setCurrentTab] = useState<HeaderTabType>("github");
	const [repos, setRepos] = useState<RepoItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (currentTab !== "github") return;

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
	}, [currentTab]);

	return (
		<div className="container" style={mainPageStyles.container}>
			<Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

			{currentTab === "github" && (
				<>
					{loading && (
						<div style={mainPageStyles.loadingMessage}>Loading ...</div>
					)}

					{error && (
						<div className="card" style={mainPageStyles.errorCard}>
							<strong style={mainPageStyles.errorTitle}>Error</strong>
							<p style={mainPageStyles.errorMessage}>{error}</p>
						</div>
					)}

					{!loading && !error && <RepoGrid repos={repos} />}
				</>
			)}
		</div>
	);
};

export default MainPage;
