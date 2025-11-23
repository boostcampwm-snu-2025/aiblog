import {
  useRepoUrlForm,
  useCommits,
  usePullRequests,
  RepoSearchForm,
} from "@features/repo-search";
import {
  usePRSummary,
  useBlogPostGeneration,
  useBlogPostSave,
  useModalState,
} from "@features/pr-summary";
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
  const prSummary = usePRSummary();
  const blogPostGeneration = useBlogPostGeneration();
  const blogPostSave = useBlogPostSave();

  const handleGenerateSummary = async (prNumber: number) => {
    if (!submittedRepoUrl) return;
    
    modalState.open(submittedRepoUrl, prNumber);
    await prSummary.generateSummary({
      url: submittedRepoUrl,
      pullNumber: prNumber,
    });
  };

  const handleGenerateBlogPost = async () => {
    if (!modalState.currentPR || !prSummary.summary) return;
    
    await blogPostGeneration.generateBlogPost({
      url: modalState.currentPR.repoUrl,
      pullNumber: modalState.currentPR.prNumber,
      summary: prSummary.summary,
    });
  };

  const handleSaveBlogPost = async () => {
    if (!modalState.currentPR || !blogPostGeneration.blogPost) return;
    
    await blogPostSave.saveBlogPost({
      url: modalState.currentPR.repoUrl,
      pullNumber: modalState.currentPR.prNumber,
      blogPost: blogPostGeneration.blogPost,
      summary: prSummary.summary ?? undefined,
      title: blogPostGeneration.blogPostTitle ?? undefined,
    });
  };

  const handleCloseModal = () => {
    modalState.close();
    prSummary.generateSummary({ url: "", pullNumber: 0 }); // Reset
    blogPostGeneration.reset();
    blogPostSave.reset();
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

  const summaryError = prSummary.error
    ? extractErrorMessage(prSummary.error, "PR 요약 생성에 실패했습니다.")
    : null;

  const blogPostError = blogPostGeneration.error
    ? extractErrorMessage(
        blogPostGeneration.error,
        "블로그 글 생성에 실패했습니다."
      )
    : null;

  const saveBlogPostError = blogPostSave.error
    ? extractErrorMessage(blogPostSave.error, "블로그 글 저장에 실패했습니다.")
    : null;

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
        onClose={handleCloseModal}
        summary={prSummary.summary}
        blogPost={blogPostGeneration.blogPost}
        blogPostTitle={blogPostGeneration.blogPostTitle}
        isLoading={prSummary.isLoading}
        isLoadingBlogPost={blogPostGeneration.isLoading}
        isSavingBlogPost={blogPostSave.isSaving}
        isBlogPostSaved={!!blogPostSave.savedId}
        error={summaryError}
        blogPostError={blogPostError}
        saveBlogPostError={saveBlogPostError}
        onGenerateBlogPost={handleGenerateBlogPost}
        onSaveBlogPost={handleSaveBlogPost}
      />
    </div>
  );
}
