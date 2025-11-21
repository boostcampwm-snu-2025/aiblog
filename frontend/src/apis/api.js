//서버 api들 호출
export const fetchActivities = async (owner, repo, branch) => {
  const response = await fetch(
    `/api/github/activities?owner=${owner}&repo=${repo}&branch=${branch}`
  );
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred." }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  const data = await response.json();
  return data;
};

export const generateBlogPost = async (commitMessage, diff) => {
  const response = await fetch("/api/blog/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commitMessage: commitMessage,
      diff: diff,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate blog post.");
  }

  const data = await response.json();
  return data.blog;
};
