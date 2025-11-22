import {
  mutationOptions,
  type QueryClient,
  queryOptions,
} from "@tanstack/react-query";
import dayjs from "dayjs";

export function createCommitSummary(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async ({
      owner,
      ref,
      repo,
    }: {
      owner: string;
      ref: string;
      repo: string;
    }) => {
      const response = await fetch(
        `/api/gemini/summaries/${owner}/${repo}/commits/${ref}`,
        { method: "POST" },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.text();
      return data;
    },
    onSettled: async (_data, _error, { owner, ref, repo }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["summaries"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["summary-exists", owner, repo, ref],
        }),
      ]);
    },
  });
}

export function deleteCommitSummary(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async ({
      owner,
      ref,
      repo,
    }: {
      owner: string;
      ref: string;
      repo: string;
    }) => {
      const response = await fetch(
        `/api/gemini/summaries/${owner}/${repo}/commits/${ref}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    },
    onSettled: async (_data, _error, { owner, ref, repo }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["summaries"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["summary-exists", owner, repo, ref],
        }),
      ]);
    },
  });
}

export function readCommitSummaries() {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/gemini/summaries`, { signal });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = (await response.json()) as {
        generatedAt: string;
        owner: string;
        ref: string;
        repo: string;
      }[];
      return data.map((item) => ({
        ...item,
        generatedAt: dayjs(item.generatedAt),
      }));
    },
    queryKey: ["summaries"],
  });
}

export function readCommitSummary(owner: string, repo: string, ref: string) {
  return queryOptions({
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/gemini/summaries/${owner}/${repo}/commits/${ref}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.text();
      return data;
    },
    queryKey: ["summaries", owner, repo, ref],
  });
}
