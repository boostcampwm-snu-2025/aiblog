import { useRepoUrlForm } from "../../features/repo-search/model/useRepoUrlForm";
import { useCommits } from "../../features/repo-search/model/useCommits";
import { usePullRequests } from "../../features/repo-search/model/usePullRequests";
import { usePRSummaryModal } from "../../features/repo-search/model/usePRSummaryModal";
import { extractErrorMessage, QueryState } from "../../shared";

import { RepoSearchForm } from "../../features/repo-search/ui/RepoSearchForm";
import { CommitList } from "../../entities/commit/ui/CommitList";
import {
  PullRequestList,
  PRSummaryModal,
} from "../../entities/pull-request/ui";

export function CommitBrowser() {
  const { repoUrl, setRepoUrl, submittedRepoUrl, onSubmitUrl } =
    useRepoUrlForm();
  const commitsQuery = useCommits(submittedRepoUrl);
  const pullRequestsQuery = usePullRequests(submittedRepoUrl);

  const prSummaryModal = usePRSummaryModal();

  const handleGenerateSummary = (prNumber: number) => {
    if (!submittedRepoUrl) return;
    prSummaryModal.generateSummary(submittedRepoUrl, prNumber);
  };

  const handleGenerateBlogPost = () => {
    // TODO: 블로그 글 생성 로직 구현
    console.log("블로그 글 생성하기", prSummaryModal.summary);
  };

  const commitsError = commitsQuery.error
    ? extractErrorMessage(commitsQuery.error, "Failed to load commits")
    : undefined;

  const pullRequestsError = pullRequestsQuery.error
    ? extractErrorMessage(
        pullRequestsQuery.error,
        "Failed to load pull requests"
      )
    : undefined;

  const formError = commitsError ?? pullRequestsError;

  return (
    <div className="space-y-6">
      <RepoSearchForm
        value={repoUrl}
        onChange={setRepoUrl}
        onSubmit={onSubmitUrl}
        error={formError}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Commits</h2>
          <QueryState
            isLoading={commitsQuery.isLoading}
            error={commitsQuery.error}
            loadingMessage="Loading commits..."
          >
            {commitsQuery.data && (
              <CommitList
                commits={commitsQuery.data.commits}
                onGenerateSummary={() => {}}
              />
            )}
          </QueryState>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pull Requests
          </h2>
          <QueryState
            isLoading={pullRequestsQuery.isLoading}
            error={pullRequestsQuery.error}
            isEmpty={pullRequestsQuery.data?.pullRequests.length === 0}
            loadingMessage="Loading pull requests..."
            emptyMessage="No pull requests found"
          >
            {pullRequestsQuery.data && (
              <PullRequestList
                pullRequests={pullRequestsQuery.data.pullRequests}
                onGenerateSummary={handleGenerateSummary}
              />
            )}
          </QueryState>
        </div>
      </div>

      <PRSummaryModal
        isOpen={prSummaryModal.isOpen}
        onClose={prSummaryModal.closeModal}
        summary={prSummaryModal.summary}
        isLoading={prSummaryModal.isLoading}
        error={prSummaryModal.error}
        onGenerateBlogPost={handleGenerateBlogPost}
      />
    </div>
  );
}
