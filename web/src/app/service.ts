import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import { readCommits, readPulls } from "~/api/github";

export function useGithubRepository() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const [ownerInput, repoInput] = searchQuery.split("/").map((s) => s.trim());
    if (ownerInput && repoInput) {
      setOwner(ownerInput);
      setRepo(repoInput);
    }
  };

  const { data: commits, status: _commitsStatus } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readCommits(owner, repo),
    queryKey: ["commits", owner, repo],
  });

  const { data: pulls, status: _pullsStatus } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  // Derived states for clearer conditional rendering
  const commitsStatus =
    !repo && !owner
      ? "idle"
      : commits && commits.length === 0
        ? "empty"
        : _commitsStatus;

  const pullsStatus =
    !repo && !owner
      ? "idle"
      : pulls && pulls.length === 0
        ? "empty"
        : _pullsStatus;

  return {
    commits,
    commitsStatus,
    handleSearch,
    owner,
    pulls,
    pullsStatus,
    repo,
    searchQuery,
    setSearchQuery,
  };
}
