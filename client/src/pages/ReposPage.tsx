import RepoList from "../component/RepoList";
import type { Repo } from "../types";
interface ReposPageProps {
  username: string;
  repos: Repo[];
  onSearch: (username: string, repo: string) => void
  onGenerate: (username: string, repoName: string) => Promise<void>
}
export default function ReposPage({ username, repos, onSearch, onGenerate }: ReposPageProps) {
  return (
    <RepoList
      repos={repos}
      username={username}
      onClick={onSearch}
      onGenerate={onGenerate}
    />
  );
}
