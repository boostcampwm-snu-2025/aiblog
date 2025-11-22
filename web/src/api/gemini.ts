export async function createCommitSummary(
  owner: string,
  repo: string,
  ref: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
    { method: "POST", signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.text();
  return data;
}

export async function deleteCommitSummary(
  owner: string,
  repo: string,
  ref: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
    { method: "DELETE", signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function readCommitSummary(
  owner: string,
  repo: string,
  ref: string,
  signal?: AbortSignal | null,
) {
  const response = await fetch(
    `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.text();
  return data;
}
