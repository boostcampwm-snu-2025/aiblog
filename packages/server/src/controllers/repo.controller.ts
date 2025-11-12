import { Request, Response, NextFunction } from "express";
import { parseGitHubUrl } from "../utils/github.utils";
import { fetchCommits } from "../services/github.service";
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
