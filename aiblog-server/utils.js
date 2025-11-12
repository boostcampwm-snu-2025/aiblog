/**
 * Helper function to parse repository name from various inputs.
 * e.g., "owner/repo", "github.com/owner/repo", "https://github.com/owner/repo"
 * @param {string} input
 * @returns {{owner: string, name: string} | null}
 */
export function parseRepoName(input) {
  if (!input) return null;
  try {
    // Try to match "owner/repo" format, ignoring domain prefixes
    const match = input.match(/github\.com[/:]([\w.-]+)\/([\w.-]+)/i);
    if (match && match[1] && match[2]) {
      return { owner: match[1], name: match[2].replace(/\.git$/, '') };
    }

    // Try to match "owner/repo" directly
    const directMatch = input.match(/^([\w.-]+)\/([\w.-]+)$/i);
    if (directMatch && directMatch[1] && directMatch[2]) {
      return { owner: directMatch[1], name: directMatch[2] };
    }

    return null; // No valid format found
  } catch (e) {
    return null;
  }
};


// Define separate fragments for Commits and PRs
const commitFields = `
  __typename
  oid
  messageHeadline
  url
  committedDate
  author {
    name
    user {
      login
    }
  }
`;

const prFields = `
  __typename
  id
  number
  title
  url
  createdAt
  author {
    login
  }
`;

/**
 * Helper function to get the correct GraphQL query based on filterType.
 * @param {'all' | 'commits' | 'prs'} filterType
 * @returns {string} The GraphQL query string
 */
const getGraphQLQuery = (filterType) => {
  // Query for Commits only
  if (filterType === 'commits') {
    return `
      query GetCommits($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 30) {
                  nodes {
                    ... on Commit {
                      ${commitFields}
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  // Query for PRs only
  if (filterType === 'prs') {
    return `
      query GetPullRequests($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          pullRequests(first: 30, states: [OPEN, CLOSED, MERGED], orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              ... on PullRequest {
                ${prFields}
              }
            }
          }
        }
      }
    `;
  }

  // Query for All (Commits + PRs) - default
  return `
    query GetAllActivity($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 20) {
                nodes {
                  ... on Commit {
                    ${commitFields}
                  }
                }
              }
            }
          }
        }
        pullRequests(first: 20, states: [OPEN, CLOSED, MERGED], orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            ... on PullRequest {
              ${prFields}
            }
          }
        }
      }
    }
  `;
};

