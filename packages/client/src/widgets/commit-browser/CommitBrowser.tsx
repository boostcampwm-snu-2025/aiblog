import { useRepoUrlForm } from "../../features/repo-search/model/useRepoUrlForm";
import { useCommits } from "../../features/repo-search/model/useCommits";
import { usePullRequests } from "../../features/repo-search/model/usePullRequests";

import { RepoSearchForm } from "../../features/repo-search/ui/RepoSearchForm";
import { CommitList } from "../../entities/commit/ui/CommitList";
import { PullRequestList } from "../../entities/pull-request/ui";

export function CommitBrowser() {
  const { repoUrl, setRepoUrl, submittedRepoUrl, onSubmitUrl } =
    useRepoUrlForm();
  const commitsQuery = useCommits(submittedRepoUrl);
  const pullRequestsQuery = usePullRequests(submittedRepoUrl);

  return (
    <div className="space-y-6">
      <RepoSearchForm
        value={repoUrl}
        onChange={setRepoUrl}
        onSubmit={onSubmitUrl}
        error={
          commitsQuery.error instanceof Error
            ? commitsQuery.error.message
            : pullRequestsQuery.error instanceof Error
            ? pullRequestsQuery.error.message
            : undefined
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Commits</h2>
          {commitsQuery.isLoading && (
            <div className="text-center py-8 text-gray-500">
              Loading commits...
            </div>
          )}
          {commitsQuery.error && (
            <div className="text-center py-8 text-red-500">
              {commitsQuery.error instanceof Error
                ? commitsQuery.error.message
                : "Failed to load commits"}
            </div>
          )}
          {commitsQuery.data && (
            <CommitList
              commits={commitsQuery.data.commits}
              onGenerateSummary={() => {}}
            />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pull Requests
          </h2>
          {pullRequestsQuery.isLoading && (
            <div className="text-center py-8 text-gray-500">
              Loading pull requests...
            </div>
          )}
          {pullRequestsQuery.error && (
            <div className="text-center py-8 text-red-500">
              {pullRequestsQuery.error instanceof Error
                ? pullRequestsQuery.error.message
                : "Failed to load pull requests"}
            </div>
          )}
          {pullRequestsQuery.data && (
            <PullRequestList
              pullRequests={pullRequestsQuery.data.pullRequests}
              onGenerateSummary={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}
