import { Request, Response, NextFunction } from "express";
import { parseGitHubUrl } from "../utils/github.utils";
import { fetchCommits, fetchPullRequests } from "../services/github.service";
import { generate as generatePRSummaryService } from "../services/prSummary.service";
import { generate as generateBlogPostService } from "../services/blogPost.service";
import { ValidationError } from "../utils/errors";

export async function getCommits(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, page, perPage } = req.query;

    if (!url || typeof url !== "string") {
      throw new ValidationError("url 쿼리 파라미터가 필요합니다.");
    }

    const pageNumber = page ? parseInt(page as string, 10) : 1;
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new ValidationError("page는 1 이상의 숫자여야 합니다.");
    }

    const perPageNumber = perPage ? parseInt(perPage as string, 10) : 30;
    if (isNaN(perPageNumber) || perPageNumber < 1) {
      throw new ValidationError("perPage는 1 이상의 숫자여야 합니다.");
    }

    const parsedUrl = parseGitHubUrl(url);

    const commits = await fetchCommits(parsedUrl, pageNumber, perPageNumber);

    res.status(200).json({
      success: true,
      data: {
        repository: `${parsedUrl.owner}/${parsedUrl.repo}`,
        page: pageNumber,
        perPage: perPageNumber,
        count: commits.length,
        commits,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPullRequests(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, page, perPage, state } = req.query;

    if (!url || typeof url !== "string") {
      throw new ValidationError("url 쿼리 파라미터가 필요합니다.");
    }

    const pageNumber = page ? parseInt(page as string, 10) : 1;
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new ValidationError("page는 1 이상의 숫자여야 합니다.");
    }

    const perPageNumber = perPage ? parseInt(perPage as string, 10) : 30;
    if (isNaN(perPageNumber) || perPageNumber < 1) {
      throw new ValidationError("perPage는 1 이상의 숫자여야 합니다.");
    }

    const prState =
      state === "open" || state === "closed" || state === "all" ? state : "all";

    const parsedUrl = parseGitHubUrl(url);

    const pullRequests = await fetchPullRequests(
      parsedUrl,
      pageNumber,
      perPageNumber,
      prState
    );

    res.status(200).json({
      success: true,
      data: {
        repository: `${parsedUrl.owner}/${parsedUrl.repo}`,
        page: pageNumber,
        perPage: perPageNumber,
        state: prState,
        count: pullRequests.length,
        pullRequests,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function generatePRSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, pullNumber } = req.body;

    if (!url || typeof url !== "string") {
      throw new ValidationError("url이 필요합니다.");
    }

    if (!pullNumber || typeof pullNumber !== "number") {
      throw new ValidationError("pullNumber는 숫자여야 합니다.");
    }

    if (pullNumber < 1 || !Number.isInteger(pullNumber)) {
      throw new ValidationError("pullNumber는 1 이상의 정수여야 합니다.");
    }

    const result = await generatePRSummaryService({
      url,
      pullNumber,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateBlogPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, pullNumber, summary } = req.body;

    if (!url || typeof url !== "string") {
      throw new ValidationError("url이 필요합니다.");
    }

    if (!pullNumber || typeof pullNumber !== "number") {
      throw new ValidationError("pullNumber는 숫자여야 합니다.");
    }

    if (pullNumber < 1 || !Number.isInteger(pullNumber)) {
      throw new ValidationError("pullNumber는 1 이상의 정수여야 합니다.");
    }

    if (!summary || typeof summary !== "string") {
      throw new ValidationError("summary가 필요합니다.");
    }

    if (summary.trim().length === 0) {
      throw new ValidationError("summary는 비어있을 수 없습니다.");
    }

    const result = await generateBlogPostService({
      url,
      pullNumber,
      summary,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
