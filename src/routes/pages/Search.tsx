import { useSearchParams } from "react-router";

import Divider from "@/components/ui/Divider";
import CreatePostHeader from "@/features/create-post/components/CreatePostHeader";
import RepositorySearchBar from "@/features/create-post/search/components/RepositorySearchBar";
import SearchResult from "@/features/create-post/search/components/SearchResult";
import type { PullRequest } from "@/types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const owner = searchParams.get("owner") ?? "";
  const repository = searchParams.get("repository") ?? "";

  const handleSearch = (owner: string, repository: string) => {
    setSearchParams({
      owner,
      repository,
    });
  };

  return (
    <div className="p-8">
      <CreatePostHeader />
      <div className="space-y-8 rounded-md border border-gray-300 p-10">
        <RepositorySearchBar initValues={{ owner, repository }} onSearch={handleSearch} />
        <Divider />
        <SearchResult repositoryName={`${owner}/${repository}`} pullRequests={mock} />
      </div>
    </div>
  );
}

const mock: PullRequest[] = [
  {
    id: 1,
    number: 28547,
    title: "Add support for React Server Components",
    state: "open",
    user: { login: "gaearon" },
    createdAt: "2024-11-05T10:30:00Z",
    mergedAt: null,
    draft: false,
  },
  {
    id: 2,
    number: 28546,
    title: "Fix hydration error in Suspense boundaries",
    state: "closed",
    user: { login: "sophiebits" },
    createdAt: "2024-11-04T15:20:00Z",
    mergedAt: "2024-11-04T16:00:00Z",
    draft: false,
  },
  {
    id: 3,
    number: 28545,
    title: "Improve performance of useEffect cleanup",
    state: "closed",
    user: { login: "acdlite" },
    createdAt: "2024-11-03T09:15:00Z",
    mergedAt: null,
    draft: false,
  },
];
