import { useState } from "react";
import useFetch from "../../../shared/hooks/useFetch";
import { getMyRepos } from "../../../shared/api/github";
import type { Repo } from "../../../shared/api/github";

export function useRepoSelection() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [showRepos, setShowRepos] = useState(false);

  const reposFetch = useFetch<Repo[], []>(getMyRepos);

  const loadRepos = () => {
    reposFetch.fetchData();
    setShowRepos(true);
  };

  const selectRepo = (o: string, r: string) => {
    setOwner(o);
    setRepo(r);
    setShowRepos(false);
  };

  return {
    owner,
    repo,
    setOwner,
    setRepo,
    showRepos,
    setShowRepos,
    reposFetch,
    loadRepos,
    selectRepo,
  };
}
