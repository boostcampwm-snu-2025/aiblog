import { baseUrl } from ".";

export async function summarizeCommit(
  owner: string,
  repo: string,
  ref: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `${baseUrl}/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.text();
  return data;
}
