import type {
  ApiResponse,
  CommitsResponse,
  PullRequestsResponse,
  GeneratePRSummaryRequest,
  GeneratePRSummaryResponse,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchCommits(
  url: string,
  page: number = 1,
  perPage: number = 30
): Promise<CommitsResponse> {
  const params = new URLSearchParams({
    url,
    page: page.toString(),
    perPage: perPage.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/repos/commits?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      status: "error",
      message: "Failed to fetch commits",
    }));
    throw new Error(error.message || "Failed to fetch commits");
  }

  const data: ApiResponse<CommitsResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch commits");
  }

  return data.data;
}

export async function fetchPullRequests(
  url: string,
  page: number = 1,
  perPage: number = 30,
  state: "open" | "closed" | "all" = "all"
): Promise<PullRequestsResponse> {
  const params = new URLSearchParams({
    url,
    page: page.toString(),
    perPage: perPage.toString(),
    state,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/repos/pulls?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      status: "error",
      message: "Failed to fetch pull requests",
    }));
    throw new Error(error.message || "Failed to fetch pull requests");
  }

  const data: ApiResponse<PullRequestsResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch pull requests");
  }

  return data.data;
}

export async function generatePRSummary(
  request: GeneratePRSummaryRequest
): Promise<GeneratePRSummaryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/repos/generate-pr-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      status: "error",
      message: "Failed to generate PR summary",
    }));
    throw new Error(error.message || "Failed to generate PR summary");
  }

  const data: ApiResponse<GeneratePRSummaryResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to generate PR summary");
  }

  return data.data;
}
