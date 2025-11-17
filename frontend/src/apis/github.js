//github api들 호출
export const fetchUserRepos = async (owner) => {
  const res = await fetch(`https://api.github.com/users/${owner}/repos`);
  return res.json();
};

export const fetchRepoBranches = async (owner, repo) => {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`
  );
  return res.json();
};

export const fetchActivities = async (owner, repo, branch) => {
  const res = await fetch(
    `/api/activities?owner=${owner}&repo=${repo}&branch=${branch}`
  );
  return res.json();
};
