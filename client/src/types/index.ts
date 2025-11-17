// ------- GitHub API Types ------- //
export interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  full_name: string;
}

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: CommitAuthor;
  date: string;
}

// ------- Common App-Level Types ------- //

// Useful for props that receive GitHub identity info
export interface RepoIdentity {
  username: string;
  repoName: string;
}

// Generic loading + error state for fetch-based components
export interface LoadState {
  loading: boolean;
  error: string;
}

// Props commonly reused for pages/components
export interface BlogPageProps {
  content: string;
}

export interface CommitListProps extends RepoIdentity {
  commits: Commit[];
}

export interface RepoListProps {
  repos: Repo[];
  username: string;
  onClick: (username: string, repoName: string) => void;
  onGenerate: (username: string, repoName: string) => Promise<void>;
}

export interface GenerateBlogButtonProps extends RepoIdentity {
  onGenerate: (username: string, repoName: string) => Promise<void>;
}

// App View Options
export type View = "repos" | "commits" | "blog";
