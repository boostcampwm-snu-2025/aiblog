import type { ApiResponse, CommitsResponse } from "./types";

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
