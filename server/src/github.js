const GH_URL = 'https://api.github.com/graphql';

export async function ghql(query, variables = {}) {
  const r = await fetch(GH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await r.text();
  if (!r.ok) {
    throw new Error(`GitHub API ${r.status}: ${text}`);
  }
  const json = JSON.parse(text);
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

export async function fetchRecentCommits({ owner, name, first = 20 }) {
  const query = `
    query($owner:String!, $name:String!, $first:Int!){
      repository(owner:$owner, name:$name){
        defaultBranchRef{
          name
          target{
            ... on Commit{
              history(first:$first){
                nodes{
                  oid
                  messageHeadline
                  message
                  committedDate
                  author { name email user { login avatarUrl } }
                  url
                }
              }
            }
          }
        }
      }
    }`;
  const data = await ghql(query, { owner, name, first });
  const nodes = data?.repository?.defaultBranchRef?.target?.history?.nodes || [];

  if (nodes.length === 0) {
    for (const branch of ['main', 'master']) {
      const q2 = `
        query($owner:String!, $name:String!, $first:Int!, $branch:String!){
          repository(owner:$owner, name:$name){
            ref(qualifiedName:$branch){
              target{
                ... on Commit{
                  history(first:$first){
                    nodes{
                      oid messageHeadline message committedDate
                      author { name email user { login avatarUrl } }
                      url
                    }
                  }
                }
              }
            }
          }
        }`;
      try {
        const d2 = await ghql(q2, { owner, name, first, branch: `refs/heads/${branch}` });
        const n2 = d2?.repository?.ref?.target?.history?.nodes || [];
        if (n2.length) return n2;
      } catch (_) {}
    }
  }
  return nodes;
}

export async function fetchRecentPRs({ owner, name, first = 20 }) {
  const query = `
    query($owner:String!, $name:String!, $first:Int!){
      repository(owner:$owner, name:$name){
        pullRequests(orderBy:{field:UPDATED_AT, direction:DESC}, first:$first){
          nodes{
            number title body updatedAt url
            author { login avatarUrl }
          }
        }
      }
    }`;
  const data = await ghql(query, { owner, name, first });
  return data?.repository?.pullRequests?.nodes || [];
}
