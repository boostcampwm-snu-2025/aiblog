export interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  updated_at: string;
  full_name: string;
}
export interface Commits {
    sha: string;
    message: string;
    author: string;
    date: string;
}