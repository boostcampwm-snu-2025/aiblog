import { useSuspenseQuery } from "@tanstack/react-query";

import { readUserRepos } from "~/api/github";

import RepositoryList from "./-repository-list";

interface Props {
  onSelectRepo: (owner: string, repo: string) => void;
  username: string;
}

function UserReposResults({ onSelectRepo, username }: Props) {
  const { data: repos } = useSuspenseQuery(readUserRepos(username));
  return <RepositoryList onSelectRepo={onSelectRepo} repos={repos} />;
}

export default UserReposResults;
