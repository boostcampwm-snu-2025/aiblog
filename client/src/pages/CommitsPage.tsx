import CommitList from "../component/CommitList";
import type { Commit } from "../types";


interface CommitsPageProps {
  username: string;
  repoName: string;
  commits: Commit[];
}

export default function CommitsPage({
  username,
  repoName,
  commits,
}: CommitsPageProps) {
  return <CommitList username={username} repoName={repoName} commits={commits} />;
}
