//데이터 fetching (owner -> repos)
import { useQuery } from "@tanstack/react-query";
import { fetchUserRepos } from "../apis/github";

export const useGithubRepos = (owner) => {
  return useQuery({
    queryKey: ["repos", owner],
    queryFn: () => fetchUserRepos(owner),
    enabled: !!owner,
  });
};
