import { useState } from "react";
import Loader from "../../../shared/ui/Loader";

import RepoInput from "../components/RepoInput";
import RepoList from "../components/RepoList";
import CommitList from "../components/CommitList";
import PRList from "../components/PRList";
import SummaryPanel from "../components/SummaryPanel";
import PRDetailModal from "../components/PRDetailModal";

import { useRepoSelection } from "../hooks/useRepoSelection";
import { useGithubData } from "../hooks/useGithubData";
import { usePRDetail } from "../hooks/usePRDetail";
import { useSummaryState } from "../hooks/useSummaryState";
import { TabSwitcher } from "../components/TabSwitcher";
import { RepoControls } from "../components/RepoControls";

export default function GithubPage() {
  const [tab, setTab] = useState<"commits" | "prs">("commits");

  const repoSel = useRepoSelection();
  const github = useGithubData(repoSel.owner, repoSel.repo);
  const prDetail = usePRDetail(repoSel.owner, repoSel.repo);
  const summary = useSummaryState();

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🔍 GitHub Repo Viewer</h1>

      <RepoControls
        loadRepos={repoSel.loadRepos}
        resetInput={() => {
          repoSel.setOwner("");
          repoSel.setRepo("");
          repoSel.setShowRepos(false);
        }}
      />

      {repoSel.showRepos ? (
        <>
          {repoSel.reposFetch.loading && <Loader text="저장소 목록 불러오는 중..." />}
          {repoSel.reposFetch.data && (
            <RepoList repos={repoSel.reposFetch.data} onSelect={repoSel.selectRepo} />
          )}
        </>
      ) : (
        <>
          <RepoInput
            owner={repoSel.owner}
            repo={repoSel.repo}
            onChangeOwner={repoSel.setOwner}
            onChangeRepo={repoSel.setRepo}
            onSubmit={github.search}
          />

          <TabSwitcher active={tab} onChange={setTab} />

          {github.loading && <Loader text="데이터 불러오는 중..." />}

          <div className="flex gap-6 items-start">
            <div className="flex-1">
              {!github.loading && tab === "commits" && github.commitsFetch.data && (
                <>
                  <CommitList
                    commits={github.commitsFetch.data}
                    owner={repoSel.owner}
                    repo={repoSel.repo}
                    onSummary={(t, s) => summary.setSummary({ title: t, content: s })}
                  />
                  {github.commitsFetch.data.length >= github.ITEMS_PER_PAGE && (
                    <button
                      onClick={github.loadMoreCommits}
                      className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      더 보기
                    </button>
                  )}
                </>
              )}

              {!github.loading && tab === "prs" && github.prsFetch.data && (
                <>
                  <PRList
                    prs={github.prsFetch.data}
                    owner={repoSel.owner}
                    repo={repoSel.repo}
                    onOpenDetail={prDetail.openDetail}
                    onSummary={(t, s) => summary.setSummary({ title: t, content: s })}
                  />
                  {github.prsFetch.data.length >= 10 && (
                    <button
                      onClick={github.loadMorePRs}
                      className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      더 보기
                    </button>
                  )}
                </>
              )}
            </div>

            <SummaryPanel
              title={summary.summary?.title ?? ""}
              summary={summary.summary?.content ?? ""}
              onSave={summary.saveSummary}
            />
          </div>
        </>
      )}

      <PRDetailModal
        open={prDetail.detailOpen}
        onClose={() => prDetail.setDetailOpen(false)}
        data={prDetail.prDetailFetch.data}
      />
    </div>
  );
}