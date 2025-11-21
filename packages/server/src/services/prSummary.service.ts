import { parseGitHubUrl } from "../utils/github.utils";
import { getPullRequest, getDiff } from "./github.service";
import { generatePRSummary } from "./llm.service";
import { AppError } from "../utils/errors";

export interface GeneratePRSummaryRequest {
  url: string;
  pullNumber: number;
}

export interface GeneratePRSummaryResponse {
  summary: string;
  prNumber: number;
  repository: string;
}

export async function generate(
  request: GeneratePRSummaryRequest
): Promise<GeneratePRSummaryResponse> {
  try {
    const parsedUrl = parseGitHubUrl(request.url);

    const prDetail = await getPullRequest(parsedUrl, request.pullNumber);

    const diff = await getDiff(prDetail.diff_url);

    const summary = await generatePRSummary(prDetail.body, diff);

    return {
      summary,
      prNumber: request.pullNumber,
      repository: `${parsedUrl.owner}/${parsedUrl.repo}`,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      500,
      `PR 요약 생성 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}
