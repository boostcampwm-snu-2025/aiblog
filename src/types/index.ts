// ============================================
// Activity Types
// ============================================
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

// ============================================
// Blog Types
// ============================================
export interface BlogMetadata {
  commitSha: string;
  author: string;
  filesChanged: number;
  stats: {
    additions: number;
    deletions: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  commitSha: string;
  owner: string;
  repo: string;
  author: string;
  filesChanged: number;
  stats: {
    additions: number;
    deletions: number;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogGenerationData {
  title: string;
  content: string;
  summary: string;
  metadata: BlogMetadata;
}

// ============================================
// Async State Pattern
// ============================================
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// ============================================
// Context Types
// ============================================
export interface BlogState {
  blogs: BlogPost[];
  currentBlog: BlogGenerationData | null;
  generationState: AsyncState<BlogGenerationData>;
  listState: AsyncState<BlogPost[]>;
}

export type BlogAction =
  | { type: 'GENERATE_BLOG_START' }
  | { type: 'GENERATE_BLOG_SUCCESS'; payload: BlogGenerationData }
  | { type: 'GENERATE_BLOG_ERROR'; payload: string }
  | { type: 'SAVE_BLOG'; payload: BlogPost }
  | { type: 'DELETE_BLOG'; payload: string }
  | { type: 'LOAD_BLOGS_START' }
  | { type: 'LOAD_BLOGS_SUCCESS'; payload: BlogPost[] }
  | { type: 'LOAD_BLOGS_ERROR'; payload: string }
  | { type: 'CLEAR_CURRENT_BLOG' }
  | { type: 'UPDATE_BLOG'; payload: BlogPost };

export interface BlogContextType {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  generateBlog: (owner: string, repo: string, commitSha: string) => Promise<void>;
  saveBlog: (owner: string, repo: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  loadBlogs: () => void;
  clearCurrentBlog: () => void;
  updateBlog: (blog: BlogPost) => Promise<void>;
}

// ============================================
// View Types
// ============================================
export type ViewMode = 'commits' | 'blogs';
