export interface PostSummary {
  id: string;
  title: string;
  tags: string[];
  date: string; // ISO string
}

export interface PostDetail extends PostSummary {
  content: string;
}

