import { parseGitHubUrl } from "../utils/github.utils";
import { getPullRequest, getDiff } from "./github.service";
import { generateBlogPost } from "./llm.service";
import { AppError } from "../utils/errors";

export interface GenerateBlogPostRequest {
  url: string;
  pullNumber: number;
  summary: string;
}

export interface GenerateBlogPostResponse {
  blogPost: string;
  prNumber: number;
  repository: string;
}

export async function generate(
  request: GenerateBlogPostRequest
): Promise<GenerateBlogPostResponse> {
  try {
    const parsedUrl = parseGitHubUrl(request.url);

    const prDetail = await getPullRequest(parsedUrl, request.pullNumber);

    const diff = await getDiff(prDetail.diff_url);

    const blogPost = await generateBlogPost(
      request.summary,
      prDetail.body,
      diff
    );

    return {
      blogPost,
      prNumber: request.pullNumber,
      repository: `${parsedUrl.owner}/${parsedUrl.repo}`,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `블로그 글 생성 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
