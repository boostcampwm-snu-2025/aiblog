import axios from "axios";

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "User-Agent": "SmartBlog-App",
};

// 공통 요청 함수
export const githubAPI = axios.create({ headers });

export const fetchCommits = async ({ owner, repo, per_page, page }) => {
  const { data } = await githubAPI.get(
    `https://api.github.com/repos/${owner}/${repo}/commits`,
    { params: { per_page, page } }
  );
  return data;
};

export const fetchPRs = async ({ owner, repo, per_page, page, state }) => {
  const { data } = await githubAPI.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    { params: { per_page, page, state } }
  );
  return data;
};

export const fetchMyRepos = async () => {
  const { data } = await githubAPI.get("https://api.github.com/user/repos", {
    params: { per_page: 30, sort: "updated" },
  });
  return data;
};

export const fetchPRDetail = async ({ owner, repo, number }) => {
  const { data } = await githubAPI.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`
  );
  return {
    number: data.number,
    title: data.title,
    body: data.body,
    author: data.user?.login,
    html_url: data.html_url,
    created_at: data.created_at,
    merged: data.merged,
  };
};