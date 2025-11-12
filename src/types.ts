export type CommitActivity = {
  kind: 'commit';
  id: string;
  sha: string;
  title: string;
  message: string;
  author: string;
  url: string;
  date: string; // ISO
};

export type PrActivity = {
  kind: 'pr';
  id: number;
  number: number;
  title: string;
  author: string;
  url: string;
  date: string; // updated_at
  state: 'open' | 'closed' | 'merged';
};

export type Activity = CommitActivity | PrActivity;

export type PagedResponse<T> = {
  items: T[];
  pageInfo: { page: number; perPage: number };
};
