import { useRepoUrlForm } from "../../features/repo-search/model/useRepoUrlForm";
import { useCommits } from "../../features/repo-search/model/useCommits";

import { RepoSearchForm } from "../../features/repo-search/ui/RepoSearchForm";
import { CommitList } from "../../entities/commit/ui/CommitList";

export function CommitBrowser() {
  const { repoUrl, setRepoUrl, submittedRepoUrl, onSubmitUrl } =
    useRepoUrlForm();
  const commitsQuery = useCommits(submittedRepoUrl);

  return (
    <div>
      <RepoSearchForm
        value={repoUrl}
        onChange={setRepoUrl}
        onSubmit={onSubmitUrl}
        error={
          commitsQuery.error instanceof Error
            ? commitsQuery.error.message
            : undefined
        }
      />
      <CommitList
        commits={commitsQuery.data?.commits ?? []}
        onGenerateSummary={() => {}}
      />
    </div>
  );
}
