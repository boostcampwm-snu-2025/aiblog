const { Octokit } = require('@octokit/core')

const GITHUB_API_VERSION = '2022-11-28'

/**
 * 사용자의 GitHub 저장소 목록 조회 (소유 + Collaborator 포함)
 * GET /api/github/repositories
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getRepositories = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      })
    }

    const accessToken = req.headers['x-github-token']

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub access token not found. Please provide X-GitHub-Token header',
      })
    }

    try {
      // Octokit 인스턴스 생성
      const octokit = new Octokit({
        auth: accessToken,
        userAgent: 'AIBlog/1.0.0',
      })

      // 1단계: 사용자가 소유한 리포지토리 조회
      const ownedResponse = await octokit.request('GET /user/repos', {
        type: 'owner',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })

      // 2단계: Collaborator 리포지토리 조회
      const collaboratorResponse = await octokit.request('GET /user/repos', {
        type: 'member',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })

      // 리포지토리 합치기 (중복 제거)
      const allRepos = [...ownedResponse.data, ...collaboratorResponse.data]
      const uniqueReposMap = new Map()

      allRepos.forEach((repo) => {
        if (!uniqueReposMap.has(repo.id)) {
          uniqueReposMap.set(repo.id, repo)
        }
      })

      // 응답 데이터 형식 변환
      const repositories = Array.from(uniqueReposMap.values()).map((repo) => ({
        id: repo.id.toString(),
        name: repo.name,
        owner: repo.owner?.login || '',
        private: repo.private === true,
      }))

      res.json({
        success: true,
        data: repositories,
      })
    } catch (apiError) {
      console.error('GitHub API error:', apiError.message)
      console.error('API error status:', apiError.status)
      throw apiError
    }
  } catch (error) {
    console.error('Get repositories error:', error.message)

    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid GitHub access token',
      })
    }

    if (error.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'GitHub API rate limit exceeded',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch repositories',
    })
  }
}

/**
 * 저장소의 커밋 목록 조회
 * GET /api/github/commits?owner=username&repo=repository-name
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getCommits = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      })
    }

    const { owner, repo } = req.query
    const accessToken = req.headers['x-github-token']

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: 'owner and repo parameters are required',
      })
    }

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub access token not found. Please provide X-GitHub-Token header',
      })
    }

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: accessToken,
      userAgent: 'AIBlog/1.0.0',
    })

    // GitHub API로 커밋 목록 조회
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      per_page: 10,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })

    // 응답 데이터 형식 변환
    const commits = response.data.map((commit) => ({
      id: commit.sha,
      message: commit.commit.message.split('\n')[0], // 첫 줄만
      author: commit.commit.author.name,
      date: new Date(commit.commit.author.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      sha: commit.sha,
    }))

    res.json({
      success: true,
      data: commits,
    })
  } catch (error) {
    console.error('Get commits error:', error.message)

    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid GitHub access token',
      })
    }

    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch commits',
    })
  }
}

/**
 * 저장소의 Pull Requests 목록 조회
 * GET /api/github/pulls?owner=username&repo=repository-name
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getPullRequests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      })
    }

    const { owner, repo } = req.query
    const accessToken = req.headers['x-github-token']

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        message: 'owner and repo parameters are required',
      })
    }

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub access token not found. Please provide X-GitHub-Token header',
      })
    }

    // Octokit 인스턴스 생성
    const octokit = new Octokit({
      auth: accessToken,
      userAgent: 'AIBlog/1.0.0',
    })

    // GitHub API로 PR 목록 조회 (모든 상태)
    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      state: 'all',
      per_page: 10,
      sort: 'updated',
      direction: 'desc',
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })

    // 응답 데이터 형식 변환
    const pullRequests = response.data.map((pr) => ({
      id: pr.id.toString(),
      title: pr.title,
      author: pr.user.login,
      date: new Date(pr.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      number: pr.number,
      status: pr.state, // 'open', 'closed'
    }))

    res.json({
      success: true,
      data: pullRequests,
    })
  } catch (error) {
    console.error('Get pull requests error:', error.message)

    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid GitHub access token',
      })
    }

    if (error.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch pull requests',
    })
  }
}

module.exports = {
  getRepositories,
  getCommits,
  getPullRequests,
}
