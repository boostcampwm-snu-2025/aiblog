import RepoInput from "../components/RepoInput";
import CommitList from "../components/CommitList";
import PRList from "../components/PRList";
import RepoList from "../components/RepoList";
import Loader from "../../../shared/ui/Loader";
import useFetch from "../../../shared/hooks/useFetch";
import { getCommits, getPRs, getMyRepos } from "../../../shared/api/github";
import type { Commit, PullRequest, Repo } from "../../../shared/api/github";
import { useState } from "react";

export default function GithubPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [activeTab, setActiveTab] = useState<"commits" | "prs">("commits");
  const [showRepos, setShowRepos] = useState(false);

  const commitsFetch = useFetch<Commit[], [string, string]>(getCommits);
  const prsFetch = useFetch<PullRequest[], [string, string]>(getPRs);
  const reposFetch = useFetch<Repo[], []>(getMyRepos);

  const handleSearch = (owner: string, repo: string) => {
    commitsFetch.fetchData(owner, repo);
    prsFetch.fetchData(owner, repo);
    setShowRepos(false);
  };

  const handleLoadRepos = () => {
    reposFetch.fetchData();
    setShowRepos(true);
  };

  const handleSelectRepo = (selectedOwner: string, selectedRepo: string) => {
    setOwner(selectedOwner);
    setRepo(selectedRepo);
    handleSearch(selectedOwner, selectedRepo);
  };

  const loading = commitsFetch.loading || prsFetch.loading;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🔍 GitHub Repo Viewer</h1>

      <div className="flex justify-center gap-3 mb-2">
        <button
          onClick={handleLoadRepos}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          내 저장소 불러오기
        </button>
        <button
          onClick={() => {
            setOwner("");
            setRepo("");
            setShowRepos(false);
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          직접 입력
        </button>
      </div>

      {showRepos ? (
        <>
          {reposFetch.loading && <Loader text="저장소 목록 불러오는 중..." />}
          {reposFetch.data && (
            <RepoList repos={reposFetch.data} onSelect={handleSelectRepo} />
          )}
        </>
      ) : (
        <>
          <RepoInput
            owner={owner}
            repo={repo}
            onChangeOwner={setOwner}
            onChangeRepo={setRepo}
            onSubmit={handleSearch}
          />

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

          {!loading && activeTab === "commits" && commitsFetch.data && (
            <CommitList commits={commitsFetch.data} />
          )}
          {!loading && activeTab === "prs" && prsFetch.data && (
            <PRList prs={prsFetch.data} />
          )}
        </>
      )}
    </div>
  );
}