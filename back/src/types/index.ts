export interface PostMeta {
  title: string;
  date: string; // ISO date-time
  repo: string;
  commit: string;
  tags: string[];
}

export interface PostListItem {
  id: string;
  title: string;
  tags: string[];
  date: string; // ISO date-time
}

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string; // ISO date-time
}

export interface CreatePostRequest {
  title: string;
  repo: string;
  commit: string;
  content: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[];
}
