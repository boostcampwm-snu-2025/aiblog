import { useRepoUrlForm } from "../../features/repo-search/model/useRepoUrlForm";
import { useCommits } from "../../features/repo-search/model/useCommits";
import { usePullRequests } from "../../features/repo-search/model/usePullRequests";
import { usePRSummaryModal } from "../../features/repo-search/model/usePRSummaryModal";
import {
  extractErrorMessage,
  QueryState,
  ToastProvider,
  useToast,
} from "../../shared";

import { RepoSearchForm } from "../../features/repo-search/ui/RepoSearchForm";
import { CommitList } from "../../entities/commit/ui/CommitList";
import {
  PullRequestList,
  PRSummaryModal,
} from "../../entities/pull-request/ui";

export function CommitBrowser() {
  const toast = useToast?.();
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
    prSummaryModal.generateBlogPostContent();
  };
  const handleSaveBlogPost = async () => {
    const ok = await prSummaryModal.saveBlogPostToServer();
    if (ok && toast) {
      toast.success("블로그 포스트가 저장되었습니다.");
    }
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
    <ToastProvider>
      <div className="space-y-6">
        <RepoSearchForm
          value={repoUrl}
          onChange={setRepoUrl}
          onSubmit={onSubmitUrl}
          error={formError}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Commits
            </h2>
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
          blogPost={prSummaryModal.blogPost}
          blogPostTitle={prSummaryModal.blogPostTitle}
          isLoading={prSummaryModal.isLoading}
          isLoadingBlogPost={prSummaryModal.isLoadingBlogPost}
          isSavingBlogPost={prSummaryModal.isSavingBlogPost}
          isBlogPostSaved={!!prSummaryModal.savedBlogPostId}
          error={prSummaryModal.error}
          blogPostError={prSummaryModal.blogPostError}
          saveBlogPostError={prSummaryModal.saveBlogPostError}
          onGenerateBlogPost={handleGenerateBlogPost}
          onSaveBlogPost={handleSaveBlogPost}
        />
      </div>
    </ToastProvider>
  );
}
