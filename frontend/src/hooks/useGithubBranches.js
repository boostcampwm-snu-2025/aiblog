//데이터 fetching (owner -> repos)
import { useQuery } from "@tanstack/react-query";
import { fetchRepoBranches } from "../apis/github";

export const useGithubBranches = (owner, repo) => {
  return useQuery({
    queryKey: ["branches", owner, repo],
    queryFn: () => fetchRepoBranches(owner, repo),
    enabled: !!owner && !!repo,
  });
};
