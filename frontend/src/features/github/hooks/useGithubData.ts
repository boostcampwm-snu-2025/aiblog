import { useState } from "react";
import useFetch from "../../../shared/hooks/useFetch";
import { getCommits, getPRs } from "../../../shared/api/github";
import type { Commit, PullRequest } from "../../../shared/api/github";

export function useGithubData(owner: string, repo: string) {
  const ITEMS_PER_PAGE = 10;
  const [commitPage, setCommitPage] = useState(1);
  const [prPage, setPrPage] = useState(1);

  const commitsFetch = useFetch<Commit[], [string, string]>(getCommits);
  const prsFetch = useFetch<PullRequest[], [string, string]>(getPRs);

  const search = (o: string, r: string) => {
    commitsFetch.fetchData(o, r);
    prsFetch.fetchData(o, r);
    setCommitPage(1);
    setPrPage(1);
  };

  const loadMoreCommits = async () => {
    const next = commitPage + 1;
    const data = await getCommits(owner, repo, next);
    commitsFetch.setData(prev => prev ? [...prev, ...data] : data);
    setCommitPage(next);
  };

  const loadMorePRs = async () => {
    const next = prPage + 1;
    const data = await getPRs(owner, repo, next);
    prsFetch.setData(prev => prev ? [...prev, ...data] : data);
    setPrPage(next);
  };

  const loading = commitsFetch.loading || prsFetch.loading;

  return {
    ITEMS_PER_PAGE,
    commitsFetch,
    prsFetch,
    search,
    loadMoreCommits,
    loadMorePRs,
    loading,
  };
}