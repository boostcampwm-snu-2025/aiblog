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

export interface ListBlogPostsRequest {
  repository?: string;
  prNumber?: number;
  limit?: number;
}

export interface BlogPostItem {
  id: string;
  repository: string;
  prNumber: number;
  title: string | null;
  summary: string | null;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function list(
  request: ListBlogPostsRequest
): Promise<BlogPostItem[]> {
  try {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      db.collection("blog_posts");

    if (request.repository) {
      query = query.where("repository", "==", request.repository);
    }
    if (typeof request.prNumber === "number") {
      query = query.where("prNumber", "==", request.prNumber);
    }

    query = query.orderBy("createdAt", "desc");

    const fetchLimit =
      typeof request.limit === "number" && request.limit > 0
        ? request.limit
        : 20;
    query = query.limit(fetchLimit);

    const snapshot = await query.get();
    const items: BlogPostItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      items.push({
        id: doc.id,
        repository: data.repository,
        prNumber: data.prNumber,
        title: data.title ?? null,
        summary: data.summary ?? null,
        content: data.content,
        createdAt:
          data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : null,
        updatedAt:
          data.updatedAt && data.updatedAt.toDate
            ? data.updatedAt.toDate().toISOString()
            : null,
      });
    });
    return items;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      500,
      `블로그 글 목록 조회 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

export async function listAll(): Promise<BlogPostItem[]> {
  try {
    const snapshot = await db
      .collection("blog_posts")
      .orderBy("createdAt", "desc")
      .get();
    const items: BlogPostItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      items.push({
        id: doc.id,
        repository: data.repository,
        prNumber: data.prNumber,
        title: data.title ?? null,
        summary: data.summary ?? null,
        content: data.content,
        createdAt:
          data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : null,
        updatedAt:
          data.updatedAt && data.updatedAt.toDate
            ? data.updatedAt.toDate().toISOString()
            : null,
      });
    });
    return items;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      500,
      `블로그 글 전체 조회 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
