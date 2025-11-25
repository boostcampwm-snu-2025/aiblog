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

export const saveBlogPost = async (blogData) => {
  const response = await fetch("/api/blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });
  if (!response.ok) {
    throw new Error("Failed to save blog post.");
  }
  return await response.json();
};

export const getAllBlogPosts = async () => {
  const response = await fetch("/api/blog");
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts.");
  }
  return await response.json();
};

export const getBlogPostById = async (id) => {
  const response = await fetch(`/api/blog/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog post.");
  }
  return await response.json();
};

export const updateBlogPost = async (id, blogData) => {
  const response = await fetch(`/api/blog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });
  if (!response.ok) {
    throw new Error("Failed to update blog post.");
  }
  return await response.json();
};

export const deleteBlogPost = async (id) => {
  const response = await fetch(`/api/blog/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete blog post.");
  }
  return await response.json();
};
