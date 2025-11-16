import type { Endpoints } from "@octokit/types";

import { useSuspenseQuery } from "@tanstack/react-query";

import { searchRepositories } from "~/api/github";

import RepositoryList from "./-repository-list";

interface Props {
  onSelectRepo: (owner: string, repo: string) => void;
  query: string;
}

function SearchReposResults({ onSelectRepo, query }: Props) {
  const { data } = useSuspenseQuery(searchRepositories(query));
  type Data =
    Endpoints["GET /search/repositories"]["response"]["data"]["items"][number];
  type FilteredData = Omit<Data, "owner"> & {
    owner: NonNullable<Data["owner"]>;
  };
  const filter = (item: Data): item is FilteredData => item.owner !== null;
  const repos = data.items.filter(filter);
  return <RepositoryList onSelectRepo={onSelectRepo} repos={repos} />;
}

export default SearchReposResults;
