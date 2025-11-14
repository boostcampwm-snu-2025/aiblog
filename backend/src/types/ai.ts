export interface GenerateContentRequest {
  prTitle: string;
  prBody: string;
  commits: string[];
}

export interface GenerateContentResponse {
  title: string;
  content: string;
}
