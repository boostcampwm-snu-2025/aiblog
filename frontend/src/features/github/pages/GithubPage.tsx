import { useState } from "react";
import RepoInput from "../components/RepoInput";
import CommitList from "../components/CommitList";
import PRList from "../components/PRList"; 
import Loader from "../../../shared/ui/Loader";
import useFetch from "../../../shared/hooks/useFetch";
import { getCommits, getPRs } from "../../../shared/api/github";
import type { Commit, PullRequest } from "../../../shared/api/github";

export default function GithubPage() {
  const {
    data: commits,
    loading: loadingCommits,
    error: errorCommits,
    fetchData: fetchCommits,
  } = useFetch<Commit[], [string, string]>(getCommits);

  const {
    data: prs,
    loading: loadingPRs,
    error: errorPRs,
    fetchData: fetchPRs,
  } = useFetch<PullRequest[], [string, string]>(getPRs);

  const [activeTab, setActiveTab] = useState<"commits" | "prs">("commits");

  const handleSearch = (owner: string, repo: string) => {
    fetchCommits(owner, repo);
    fetchPRs(owner, repo);
  };

  const loading = loadingCommits || loadingPRs;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🔍 GitHub Repo Viewer</h1>
      <RepoInput onSubmit={handleSearch} />

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("commits")}
          className={`px-4 py-2 rounded ${
            activeTab === "commits"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Commits
        </button>
        <button
          onClick={() => setActiveTab("prs")}
          className={`px-4 py-2 rounded ${
            activeTab === "prs"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Pull Requests
        </button>
      </div>

      {loading && <Loader text="데이터 불러오는 중..." />}

      {!loading && activeTab === "commits" && (
        <>
          {errorCommits && <p className="text-red-500">{errorCommits}</p>}
          {commits && <CommitList commits={commits} />}
        </>
      )}

      {!loading && activeTab === "prs" && (
        <>
          {errorPRs && <p className="text-red-500">{errorPRs}</p>}
          {prs && <PRList prs={prs} />}
        </>
      )}
    </div>
  );
}