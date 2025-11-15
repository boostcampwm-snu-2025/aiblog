export type PostEditorData = {
  title: string;
  content: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  // TODO: 추후 구현
  github?: {
    repo: string;
    prNumber: number;
    prTitle: string;
  };
};
