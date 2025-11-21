const { createGitHubClient, makeGitHubRequest } = require('../utils/githubClient')
const { transformRepositories, transformCommits, transformPullRequests } = require('../utils/responseTransformers')
const { sendUnauthorized, sendBadRequest, handleGitHubError } = require('../utils/errorHandler')

/**
 * 사용자의 GitHub 저장소 목록 조회 (소유 + Collaborator 포함)
 * GET /api/github/repositories
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getRepositories = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, 'Not authenticated')
    }

    const accessToken = req.headers['x-github-token']

    if (!accessToken) {
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    try {
      // GitHub 클라이언트 생성
      const octokit = createGitHubClient(accessToken)

      // 1단계: 사용자가 소유한 리포지토리 조회
      const ownedResponse = await makeGitHubRequest(octokit, 'GET /user/repos', {
        type: 'owner',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      })

      // 2단계: Collaborator 리포지토리 조회
      const collaboratorResponse = await makeGitHubRequest(octokit, 'GET /user/repos', {
        type: 'member',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
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
      const repositories = transformRepositories(Array.from(uniqueReposMap.values()))

      res.json({
        success: true,
        data: repositories,
      })
    } catch (apiError) {
      return handleGitHubError(apiError, res, 'Get repositories')
    }
  } catch (error) {
    return handleGitHubError(error, res, 'Get repositories')
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
      return sendUnauthorized(res, 'Not authenticated')
    }

    const { owner, repo } = req.query
    const accessToken = req.headers['x-github-token']

    if (!owner || !repo) {
      return sendBadRequest(res, 'owner and repo parameters are required')
    }

    if (!accessToken) {
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    try {
      // GitHub 클라이언트 생성
      const octokit = createGitHubClient(accessToken)

      // GitHub API로 커밋 목록 조회
      const response = await makeGitHubRequest(octokit, 'GET /repos/{owner}/{repo}/commits', {
        owner,
        repo,
        per_page: 100,
      })

      // 응답 데이터 형식 변환
      const commits = transformCommits(response.data)

      res.json({
        success: true,
        data: commits,
      })
    } catch (apiError) {
      return handleGitHubError(apiError, res, 'Get commits')
    }
  } catch (error) {
    return handleGitHubError(error, res, 'Get commits')
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
      return sendUnauthorized(res, 'Not authenticated')
    }

    const { owner, repo } = req.query
    const accessToken = req.headers['x-github-token']

    if (!owner || !repo) {
      return sendBadRequest(res, 'owner and repo parameters are required')
    }

    if (!accessToken) {
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    try {
      // GitHub 클라이언트 생성
      const octokit = createGitHubClient(accessToken)

      // GitHub API로 PR 목록 조회 (모든 상태)
      const response = await makeGitHubRequest(octokit, 'GET /repos/{owner}/{repo}/pulls', {
        owner,
        repo,
        state: 'all',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      })

      // 응답 데이터 형식 변환
      const pullRequests = transformPullRequests(response.data)

      res.json({
        success: true,
        data: pullRequests,
      })
    } catch (apiError) {
      return handleGitHubError(apiError, res, 'Get pull requests')
    }
  } catch (error) {
    return handleGitHubError(error, res, 'Get pull requests')
  }
}

/**
 * PR 상세 정보 조회 (본문, 코멘트, README 포함)
 * GET /api/github/pull/:owner/:repo/:number/details
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getPullRequestDetails = async (req, res) => {
  try {
    console.log('=== getPullRequestDetails 함수 진입 ===')
    console.log('요청 경로:', req.path)
    console.log('요청 파라미터:', req.params)

    if (!req.user) {
      console.log('사용자 정보 없음 - authMiddleware 실패')
      return sendUnauthorized(res, 'Not authenticated')
    }

    console.log('사용자 인증 완료:', req.user.id)

    const { owner, repo, number } = req.params
    const accessToken = req.headers['x-github-token']

    console.log('파라미터 확인:')
    console.log('- owner:', owner)
    console.log('- repo:', repo)
    console.log('- number:', number)
    console.log('- GitHub Token:', accessToken ? '있음' : '없음')

    if (!owner || !repo || !number) {
      console.log('파라미터 누락')
      return sendBadRequest(res, 'owner, repo, and number parameters are required')
    }

    if (!accessToken) {
      console.log('GitHub 토큰 없음')
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    console.log('모든 검증 완료, GitHub API 호출 시작')

    try {
      // GitHub 클라이언트 생성
      const octokit = createGitHubClient(accessToken)

      // 1. PR 상세 정보 조회
      const prResponse = await makeGitHubRequest(octokit, 'GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner,
        repo,
        pull_number: number,
      })

      const pr = prResponse.data
      const details = {
        body: pr.body || '',
        comments: [],
        readme: '',
        files: '',
      }

      // 2. PR 변경 파일 목록 조회
      try {
        const filesResponse = await makeGitHubRequest(
          octokit,
          'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
          {
            owner,
            repo,
            pull_number: number,
            per_page: 50, // 최대 50개까지 조회
          }
        )

        // 상위 10개 파일의 diff 내용 추출
        const fileDiffs = filesResponse.data
          .slice(0, 10)
          .map((file) => {
            let diffContent = `파일: ${file.filename}\n상태: ${file.status}\n변경사항: +${file.additions}/-${file.deletions}\n`
            if (file.patch) {
              diffContent += `코드 변경:\n${file.patch}\n`
            }
            return diffContent
          })
          .join('\n---\n')

        details.files = fileDiffs.substring(0, 2000) // 최대 2000자 제한
      } catch (filesError) {
        console.log('PR files not available:', filesError.message)
        // 파일 조회 실패해도 계속 진행
      }

      // 3. PR 모든 코멘트 조회
      try {
        const commentsResponse = await makeGitHubRequest(
          octokit,
          'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
          {
            owner,
            repo,
            pull_number: number,
            per_page: 100, // 한 번에 100개까지 조회
          }
        )

        // 모든 코멘트 포함
        details.comments = commentsResponse.data
          .map((comment) => `${comment.user.login}: ${comment.body}`)
          .join('\n---\n')
      } catch (commentError) {
        console.log('Comments not available:', commentError.message)
        // 코멘트 조회 실패해도 계속 진행
      }

      // 4. README.md 조회 (전체 내용)
      try {
        const readmeResponse = await makeGitHubRequest(
          octokit,
          'GET /repos/{owner}/{repo}/readme',
          {
            owner,
            repo,
          },
          {
            headers: {
              Accept: 'application/vnd.github.v3.raw',
            },
          }
        )

        // raw markdown 반환 시 전체 내용 포함 (Buffer 처리 포함)
        if (readmeResponse.data) {
          details.readme = typeof readmeResponse.data === 'string'
            ? readmeResponse.data
            : Buffer.isBuffer(readmeResponse.data)
            ? readmeResponse.data.toString('utf-8')
            : String(readmeResponse.data)
        } else {
          details.readme = ''
        }
      } catch (readmeError) {
        console.log('README not found:', readmeError.message)
        details.readme = '' // 조회 실패 시 빈 문자열로 설정
      }

      console.log('=== PR Details 수집 완료 ===')
      try {
        console.log('PR Body 길이:', details.body?.length || 0)
        console.log('Files 길이:', details.files?.length || 0)
        console.log('Comments 길이:', details.comments?.length || 0)
        console.log('README 길이:', details.readme?.length || 0)
        if (typeof details.files === 'string') console.log('Files 샘플:', details.files.substring(0, 200))
        if (typeof details.comments === 'string') console.log('Comments 샘플:', details.comments.substring(0, 200))
        if (typeof details.readme === 'string') console.log('README 샘플:', details.readme.substring(0, 200))
      } catch (logError) {
        console.log('로깅 에러:', logError.message)
      }

      res.json({
        success: true,
        data: details,
      })
    } catch (apiError) {
      return handleGitHubError(apiError, res, 'Get pull request details')
    }
  } catch (error) {
    return handleGitHubError(error, res, 'Get pull request details')
  }
}

/**
 * Commit 상세 정보 조회 (파일 diff 포함)
 * GET /api/github/commit/:owner/:repo/:sha/details
 * 헤더: X-GitHub-Token: <GitHub Access Token>
 */
const getCommitDetails = async (req, res) => {
  try {
    console.log('=== getCommitDetails 함수 진입 ===')
    console.log('요청 경로:', req.path)
    console.log('요청 파라미터:', req.params)

    if (!req.user) {
      console.log('사용자 정보 없음 - authMiddleware 실패')
      return sendUnauthorized(res, 'Not authenticated')
    }

    console.log('사용자 인증 완료:', req.user.id)

    const { owner, repo, sha } = req.params
    const accessToken = req.headers['x-github-token']

    console.log('파라미터 확인:')
    console.log('- owner:', owner)
    console.log('- repo:', repo)
    console.log('- sha:', sha)
    console.log('- GitHub Token:', accessToken ? '있음' : '없음')

    if (!owner || !repo || !sha) {
      console.log('파라미터 누락')
      return sendBadRequest(res, 'owner, repo, and sha parameters are required')
    }

    if (!accessToken) {
      console.log('GitHub 토큰 없음')
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    console.log('모든 검증 완료, GitHub API 호출 시작')

    try {
      // GitHub 클라이언트 생성
      const octokit = createGitHubClient(accessToken)

      // 1. Commit 상세 정보 조회
      const commitResponse = await makeGitHubRequest(
        octokit,
        'GET /repos/{owner}/{repo}/commits/{ref}',
        {
          owner,
          repo,
          ref: sha,
        }
      )

      const commit = commitResponse.data
      const details = {
        message: commit.commit.message || '',
        author: commit.commit.author.name || '',
        date: commit.commit.author.date || '',
        files: '',
      }

      // 2. Commit 파일 변경사항 조회 (parent와 현재 commit 비교)
      try {
        if (commit.parents && commit.parents.length > 0) {
          const parentSha = commit.parents[0].sha

          console.log('Commit 비교 시작:')
          console.log('- Parent SHA:', parentSha)
          console.log('- Current SHA:', sha)

          const compareResponse = await makeGitHubRequest(
            octokit,
            'GET /repos/{owner}/{repo}/compare/{base}...{head}',
            {
              owner,
              repo,
              base: parentSha,
              head: sha,
            }
          )

          if (compareResponse.data.files && compareResponse.data.files.length > 0) {
            const fileDiffs = compareResponse.data.files
              .slice(0, 10) // 상위 10개 파일
              .map((file) => {
                let diffContent = `파일: ${file.filename}\n상태: ${file.status}\n변경사항: +${file.additions}/-${file.deletions}\n`
                if (file.patch) {
                  diffContent += `코드 변경:\n${file.patch}\n`
                }
                return diffContent
              })
              .join('\n---\n')

            details.files = fileDiffs.substring(0, 3000) // 최대 3000자로 확대
            console.log('Commit 파일 변경사항 조회 성공')
          }
        }
      } catch (filesError) {
        console.log('Commit 파일 변경사항 조회 실패:', filesError.message)
        // 파일 조회 실패해도 계속 진행
      }

      console.log('=== Commit Details 수집 완료 ===')
      try {
        console.log('Message 길이:', details.message?.length || 0)
        console.log('Files 길이:', details.files?.length || 0)
        if (typeof details.files === 'string') console.log('Files 샘플:', details.files.substring(0, 200))
      } catch (logError) {
        console.log('로깅 에러:', logError.message)
      }

      res.json({
        success: true,
        data: details,
      })
    } catch (apiError) {
      return handleGitHubError(apiError, res, 'Get commit details')
    }
  } catch (error) {
    return handleGitHubError(error, res, 'Get commit details')
  }
}

module.exports = {
  getRepositories,
  getCommits,
  getPullRequests,
  getPullRequestDetails,
  getCommitDetails,
}
