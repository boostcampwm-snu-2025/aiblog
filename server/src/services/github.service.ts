import { graphql } from '@octokit/graphql';
import { config } from '../config/env';
import { GitHubCommit, GitHubPullRequest } from '../types';

// Initialize GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${config.github.token}`,
  },
});

/**
 * Fetch commits using GitHub GraphQL API
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param limit - Number of commits to fetch (default: 10)
 */
export async function fetchCommitsGraphQL(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<GitHubCommit[]> {
  try {
    const query = `
      query ($owner: String!, $repo: String!, $limit: Int!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: $limit) {
                  nodes {
                    oid
                    message
                    author {
                      name
                      email
                      date
                    }
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response: any = await graphqlWithAuth(query, {
      owner,
      repo,
      limit,
    });

    const commits = response.repository.defaultBranchRef.target.history.nodes;

    // Transform to match our GitHubCommit type
    return commits.map((commit: any) => ({
      sha: commit.oid,
      commit: {
        message: commit.message,
        author: {
          name: commit.author.name || 'Unknown',
          email: commit.author.email || '',
          date: commit.author.date,
        },
      },
      html_url: commit.url,
    }));
  } catch (error: any) {
    console.error('GraphQL API Error:', error.message);
    throw new Error(`Failed to fetch commits via GraphQL: ${error.message}`);
  }
}

/**
 * Fetch pull requests using GitHub GraphQL API
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param state - PR state ("OPEN", "CLOSED", "MERGED")
 * @param limit - Number of PRs to fetch (default: 10)
 */
export async function fetchPullRequestsGraphQL(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<GitHubPullRequest[]> {
  try {
    const query = `
      query ($owner: String!, $repo: String!, $limit: Int!) {
        repository(owner: $owner, name: $repo) {
          pullRequests(first: $limit, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              id
              number
              title
              body
              state
              createdAt
              updatedAt
              url
              author {
                login
              }
            }
          }
        }
      }
    `;

    const response: any = await graphqlWithAuth(query, {
      owner,
      repo,
      limit,
    });

    const prs = response.repository.pullRequests.nodes;

    // Transform to match our GitHubPullRequest type
    return prs.map((pr: any) => ({
      id: pr.number, // Using number as ID for consistency
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.state.toLowerCase(),
      created_at: pr.createdAt,
      updated_at: pr.updatedAt,
      html_url: pr.url,
      user: {
        login: pr.author?.login || 'Unknown',
      },
    }));
  } catch (error: any) {
    console.error('GraphQL API Error:', error.message);
    throw new Error(
      `Failed to fetch pull requests via GraphQL: ${error.message}`
    );
  }
}

/**
 * Get repository information using GraphQL API
 * Fetches EVERYTHING in one request - this is GraphQL's superpower!
 */
export async function fetchRepoInfoGraphQL(owner: string, repo: string) {
  try {
    const query = `
      query ($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          name
          nameWithOwner
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          createdAt
          updatedAt
          url
        }
      }
    `;

    const response: any = await graphqlWithAuth(query, {
      owner,
      repo,
    });

    const repoData = response.repository;

    return {
      name: repoData.name,
      full_name: repoData.nameWithOwner,
      description: repoData.description,
      stars: repoData.stargazerCount,
      forks: repoData.forkCount,
      language: repoData.primaryLanguage?.name,
      created_at: repoData.createdAt,
      updated_at: repoData.updatedAt,
      url: repoData.url,
    };
  } catch (error: any) {
    console.error('GraphQL API Error:', error.message);
    throw new Error(`Failed to fetch repo info via GraphQL: ${error.message}`);
  }
}

/**
 * BONUS: Fetch EVERYTHING in ONE GraphQL request!
 * This shows GraphQL's power - get commits, PRs, and repo info in a single call
 */
export async function fetchEverythingGraphQL(
  owner: string,
  repo: string,
  commitLimit: number = 10,
  prLimit: number = 10
) {
  try {
    const query = `
      query ($owner: String!, $repo: String!, $commitLimit: Int!, $prLimit: Int!) {
        repository(owner: $owner, name: $repo) {
          name
          nameWithOwner
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: $commitLimit) {
                  nodes {
                    oid
                    message
                    author {
                      name
                      email
                      date
                    }
                    url
                  }
                }
              }
            }
          }
          pullRequests(first: $prLimit, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              id
              number
              title
              body
              state
              createdAt
              updatedAt
              url
              author {
                login
              }
            }
          }
        }
      }
    `;

    const response: any = await graphqlWithAuth(query, {
      owner,
      repo,
      commitLimit,
      prLimit,
    });

    const repoData = response.repository;

    return {
      repository: {
        name: repoData.name,
        full_name: repoData.nameWithOwner,
        description: repoData.description,
        stars: repoData.stargazerCount,
        forks: repoData.forkCount,
        language: repoData.primaryLanguage?.name,
      },
      commits: repoData.defaultBranchRef.target.history.nodes.map(
        (commit: any) => ({
          sha: commit.oid,
          commit: {
            message: commit.message,
            author: {
              name: commit.author.name || 'Unknown',
              email: commit.author.email || '',
              date: commit.author.date,
            },
          },
          html_url: commit.url,
        })
      ),
      pullRequests: repoData.pullRequests.nodes.map((pr: any) => ({
        id: pr.number,
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state.toLowerCase(),
        created_at: pr.createdAt,
        updated_at: pr.updatedAt,
        html_url: pr.url,
        user: {
          login: pr.author?.login || 'Unknown',
        },
      })),
    };
  } catch (error: any) {
    console.error('GraphQL API Error:', error.message);
    throw new Error(`Failed to fetch data via GraphQL: ${error.message}`);
  }
}
