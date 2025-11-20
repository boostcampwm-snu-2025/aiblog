import { useSearchParams } from "react-router";

import { usePullRequests } from "@/features/search/api/useQueryPullRequests";
import RepositorySearchBar from "@/features/search/components/RepositorySearchBar";
import SearchResult from "@/features/search/components/SearchResult";
import Divider from "@/shared/ui/Divider";
import { ErrorFallback, LoadingFallback } from "@/shared/ui/Fallback";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const owner = searchParams.get("owner") ?? "";
  const repository = searchParams.get("repository") ?? "";

  const hasSearchParams = owner !== "" && repository !== "";

  const { data: pullRequests, status } = usePullRequests({
    params: { owner, repository },
    queryConfig: { enabled: hasSearchParams },
  });

  const handleSearch = (owner: string, repository: string) => {
    if (owner === "" || repository === "") {
      alert("owner와 repository를 모두 입력해주세요.");
      return;
    }
    setSearchParams({
      owner,
      repository,
    });
  };

  return (
    <div className="p-8">
      <div className="space-y-8 p-10">
        <RepositorySearchBar initValues={{ owner, repository }} onSearch={handleSearch} />
        <Divider />
        {hasSearchParams ? (
          <>
            {status === "pending" && <LoadingFallback message="PR 목록을 불러오는 중..." />}
            {status === "error" && <ErrorFallback />}
            {status === "success" && <SearchResult owner={owner} repository={repository} pullRequests={pullRequests} />}
          </>
        ) : (
          <div>레포지토리를 검색해보세요.</div>
        )}
      </div>
    </div>
  );
}
