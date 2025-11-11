import RepoInput from "../components/RepoInput";
import CommitList from "../components/CommitList";
import PRList from "../components/PRList";
import RepoList from "../components/RepoList";
import PRDetailModal from "../components/PRDetailModal";
import Loader from "../../../shared/ui/Loader";
import useFetch from "../../../shared/hooks/useFetch";
import {
  getCommits,
  getPRs,
  getMyRepos,
  getSimplePRDetail,
} from "../../../shared/api/github";
import type {
  Commit,
  PullRequest,
  Repo,
  SimplePRDetail,
} from "../../../shared/api/github";
import { useState, useEffect } from "react";

export default function GithubPage() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [activeTab, setActiveTab] = useState<"commits" | "prs">("commits");
  const [showRepos, setShowRepos] = useState(false);

  const [commitPage, setCommitPage] = useState(1);
  const [prPage, setPrPage] = useState(1);

  const commitsFetch = useFetch<Commit[], [string, string]>(getCommits);
  const prsFetch = useFetch<PullRequest[], [string, string]>(getPRs);
  const reposFetch = useFetch<Repo[], []>(getMyRepos);

  // ✅ PR 상세용 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  const prDetailFetch = useFetch<SimplePRDetail, [string, string, number]>(
    getSimplePRDetail
  );

  const handleSearch = (o: string, r: string) => {
    commitsFetch.fetchData(o, r);
    prsFetch.fetchData(o, r);
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

  // ✅ 상세 보기 열기
  const openPRDetail = (number: number) => {
    if (!owner || !repo) return;
    setSelectedPR(number);
    setDetailOpen(true);
  };

  // ✅ 상세 정보 fetch
  useEffect(() => {
    if (detailOpen && selectedPR != null && owner && repo) {
      prDetailFetch.fetchData(owner, repo, selectedPR);
    }
  }, [detailOpen, selectedPR, owner, repo]);

  const handleLoadMoreCommits = async () => {
    const nextPage = commitPage + 1;
    const newData = await getCommits(owner, repo, nextPage);
    if (commitsFetch.data) {
      commitsFetch.data.push(...newData);
    }
    setCommitPage(nextPage);
  };

  const handleLoadMorePRs = async () => {
    const nextPage = prPage + 1;
    const newData = await getPRs(owner, repo, nextPage);
    if (prsFetch.data) {
      prsFetch.data.push(...newData);
    }
    setPrPage(nextPage);
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
            <>
              <CommitList commits={commitsFetch.data} />
              {commitsFetch.data.length >= 10 && (
                <button
                  onClick={handleLoadMoreCommits}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  더 보기
                </button>
              )}
            </>
          )}

          {!loading && activeTab === "prs" && prsFetch.data && (
            <>
              <PRList prs={prsFetch.data} onOpenDetail={openPRDetail} />
              {prsFetch.data.length >= 10 && (
                <button
                  onClick={handleLoadMorePRs}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  더 보기
                </button>
              )}
            </>
          )}
        </>
      )}

      {/* ✅ PR 상세 모달 */}
      <PRDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={prDetailFetch.data}
      />
    </div>
  );
}