async function githubFetch(path, params = {}) {
  const query = Object.keys(params).length
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const url = `https://api.github.com${path}${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "SmartBlog-App",
    },
  });

  if (!res.ok) {
    try {
      const errData = await res.json();
      throw new Error(errData.message || `GitHub API error: ${res.status}`);
    } catch {
      throw new Error('parse error~~');
    }
  }

  return res.json();
}

export const fetchCommits = ({ owner, repo, per_page, page }) =>
  githubFetch(`/repos/${owner}/${repo}/commits`, { per_page, page });

export const fetchPRs = ({ owner, repo, per_page, page, state }) =>
  githubFetch(`/repos/${owner}/${repo}/pulls`, { per_page, page, state });

export const fetchMyRepos = () =>
  githubFetch(`/user/repos`, { per_page: 30, sort: "updated" });

export const fetchPRDetail = async ({ owner, repo, number }) => {
  const data = await githubFetch(`/repos/${owner}/${repo}/pulls/${number}`);

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

export const fetchCommitDetail = ({ owner, repo, sha }) =>
  githubFetch(`/repos/${owner}/${repo}/commits/${sha}`);