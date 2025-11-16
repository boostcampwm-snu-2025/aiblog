import admin from "firebase-admin";
import { db } from "../config/firebase";
import { parseGitHubUrl } from "../utils/github.utils";
import { AppError } from "../utils/errors";

export interface SaveBlogPostRequest {
  url: string;
  pullNumber: number;
  blogPost: string;
  summary?: string | null;
  title?: string | null;
}

export interface SaveBlogPostResponse {
  id: string;
  repository: string;
  prNumber: number;
}

export async function save(
  request: SaveBlogPostRequest
): Promise<SaveBlogPostResponse> {
  try {
    const parsed = parseGitHubUrl(request.url);
    const repository = `${parsed.owner}/${parsed.repo}`;

    const nowServerTs = admin.firestore.FieldValue.serverTimestamp();

    const doc = {
      repository,
      prNumber: request.pullNumber,
      title: request.title ?? null,
      summary: request.summary ?? null,
      content: request.blogPost,
      createdAt: nowServerTs,
      updatedAt: nowServerTs,
    };

    const ref = await db.collection("blog_posts").add(doc);

    return {
      id: ref.id,
      repository,
      prNumber: request.pullNumber,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      500,
      `블로그 글 저장 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
