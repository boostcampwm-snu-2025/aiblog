export type Repository = {
  id: number;
  name: string;
  owner: string | null;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updated_at: string;
}