import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const createCommitSummary = 
  mutationOptions({
    mutationFn: async ({ owner, ref, repo }: { owner: string; ref: string; repo: string; }) => {
      const response = await fetch(
        `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
        { method: "POST" },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.text();
      return data;
    }
  });

export const deleteCommitSummary = 
  mutationOptions({
    mutationFn: async ({ owner, ref, repo }: { owner: string; ref: string; repo: string; }) => {
      const response = await fetch(
        `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    }
  });

export function existsCommitSummary(owner: string, repo: string, ref: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
        { method: "HEAD", signal },
      );
      if (response.status === 204) {
        return true;
      }
      if (response.status === 404) {
        return false;
      }
      throw new Error(response.statusText);
    },
    queryKey: ["summary-exists", owner, repo, ref]
  });
}

export function readCommitSummary(
  owner: string,
  repo: string,
  ref: string
) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/gemini/summary/${owner}/${repo}/commits/${ref}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.text();
      return data;
    },
    queryKey: ["summary", owner, repo, ref]
  });
}
