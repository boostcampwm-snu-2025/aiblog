import type { PullRequest } from "@/entities/pullrequest";
import Badge from "@/shared/ui/Badge";

import SearchResultItem from "./SearchResultItem";

type SearchResultProps = {
  owner: string;
  repository: string;
  pullRequests: PullRequest[];
};

export default function SearchResult({ owner, repository, pullRequests }: SearchResultProps) {
  return (
    <section>
      <Badge bgColor="bg-gray-200">
        {owner}/{repository}
      </Badge>
      <ul className="mt-5 space-y-4">
        {pullRequests.map((pr) => (
          <SearchResultItem key={pr.number} pullRequest={pr} repository={repository} owner={owner} />
        ))}
      </ul>
    </section>
  );
}
