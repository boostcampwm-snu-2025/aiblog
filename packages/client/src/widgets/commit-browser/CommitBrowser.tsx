import { useState } from "react";
import { useRepoUrlForm } from "../../features/repo-search/model/useRepoUrlForm";
import { useCommits } from "../../features/repo-search/model/useCommits";
import { usePullRequests } from "../../features/repo-search/model/usePullRequests";
import { generatePRSummary } from "../../shared/api";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async (prNumber: number) => {
    if (!submittedRepoUrl) {
      setError("레포지토리 URL이 필요합니다.");
      return;
    }

    setIsModalOpen(true);
    setIsLoadingSummary(true);
    setError(null);
    setSummary(null);

    try {
      const result = await generatePRSummary({
        url: submittedRepoUrl,
        pullNumber: prNumber,
      });
      setSummary(result.summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "요약 생성에 실패했습니다."
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSummary(null);
    setError(null);
  };

  const handleGenerateBlogPost = () => {
    // TODO: 블로그 글 생성 로직 구현
    console.log("블로그 글 생성하기", summary);
  };

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
              onGenerateSummary={handleGenerateSummary}
            />
          )}
        </div>
      </div>

      <PRSummaryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        summary={summary}
        isLoading={isLoadingSummary}
        error={error}
        onGenerateBlogPost={handleGenerateBlogPost}
      />
    </div>
  );
}
