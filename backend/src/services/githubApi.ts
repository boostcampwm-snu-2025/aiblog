import { config } from "../config/env.js";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = config.github.token;

export const fetchGithubData = async <T = unknown>(
  endpoint: string
): Promise<{ data: T; headers: Headers }> => {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  return { data, headers: response.headers };
};
