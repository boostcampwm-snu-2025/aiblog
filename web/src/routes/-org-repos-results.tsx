import { useSuspenseQuery } from "@tanstack/react-query";

import { readOrgRepos } from "~/api/github";

import RepositoryList from "./-repository-list";

interface Props {
  onSelectRepo: (owner: string, repo: string) => void;
  org: string;
}

function OrgReposResults({ onSelectRepo, org }: Props) {
  const { data: repos } = useSuspenseQuery(readOrgRepos(org));
  return <RepositoryList onSelectRepo={onSelectRepo} repos={repos} />;
}

export default OrgReposResults;
