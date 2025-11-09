import { TextInput } from "../../../shared";
import { useRepoUrlForm } from "../model/useRepoUrlForm";
import { useCommits } from "../../../shared/hooks";

export function RepoSearchForm() {
  const { repoUrl, setRepoUrl, submittedRepoUrl, onSubmitUrl } =
    useRepoUrlForm();
  const commitsQuery = useCommits(submittedRepoUrl);

  const inputErrorMessage =
    commitsQuery.error instanceof Error
      ? commitsQuery.error.message
      : undefined;

  return (
    <form className="flex w-full gap-3 items-center" onSubmit={onSubmitUrl}>
      <TextInput
        label="Repository URL"
        placeholder="https://github.com/owner/repository"
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        fullWidth
        required
        errorText={inputErrorMessage}
      />
    </form>
  );
}
