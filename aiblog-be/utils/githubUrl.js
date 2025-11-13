export function parseGithubUsernameFromUrl(url) {
	try {
		const u = new URL(url);
		if (u.hostname !== "github.com") return null;
		const parts = u.pathname.split("/").filter(Boolean);
		if (parts.length < 1) return null;
		return parts[0];
	} catch {
		return null;
	}
}
