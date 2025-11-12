export function getEnvGitHubToken(): string | null {
	const raw = import.meta.env.VITE_GITHUB_TOKEN;
	if (typeof raw === "string" && raw.trim().length > 0) {
		return raw.trim();
	}
	return null;
}
