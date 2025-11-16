const GITHUB_API_URL = "https://api.github.com";

let GITHUB_TOKEN: string | undefined = undefined;

const getGitHubToken = () => {
  if (GITHUB_TOKEN === undefined) {
    GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN is not defined in environment variables");
    }
  }

  return GITHUB_TOKEN;
};

export const fetchGithubData = async <T = unknown>(
  endpoint: string
): Promise<T> => {
  const token = getGitHubToken();

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (response.status !== 200) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
};
