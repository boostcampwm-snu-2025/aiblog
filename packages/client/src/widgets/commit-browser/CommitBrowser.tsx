import {
  useRepoUrlForm,
  useCommits,
  usePullRequests,
  RepoSearchForm,
} from "@features/repo-search";
import { useModalState } from "@features/pr-summary";
import { extractErrorMessage, QueryState } from "@shared/index";
import { CommitList } from "@entities/commit";
import { PullRequestList } from "@entities/pull-request/ui";
import { PRSummaryModal } from "@widgets/pr-summary";

export function CommitBrowser() {
  const { repoUrl, setRepoUrl, submittedRepoUrl, onSubmitUrl } =
    useRepoUrlForm();
  const commitsQuery = useCommits(submittedRepoUrl);
  const pullRequestsQuery = usePullRequests(submittedRepoUrl);

  const modalState = useModalState();

  const handleGenerateSummary = (prNumber: number) => {
    if (!submittedRepoUrl) return;
    modalState.open(submittedRepoUrl, prNumber);
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
        isOpen={modalState.isOpen}
        onClose={modalState.close}
        repoUrl={modalState.currentPR?.repoUrl ?? null}
        prNumber={modalState.currentPR?.prNumber ?? null}
      />
    </div>
  );
}
