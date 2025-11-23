const { Octokit } = require('@octokit/core')

const GITHUB_API_VERSION = '2022-11-28'
const GITHUB_PER_PAGE = 100
const GITHUB_MAX_FILE_COUNT = 10
const GITHUB_MAX_COMMENT_COUNT = 100
const GITHUB_MAX_FILE_CHAR_LENGTH = 2000
const GITHUB_MAX_COMMIT_CHAR_LENGTH = 3000

/**
 * GitHub API 클라이언트 생성
 * @param {string} accessToken - GitHub access token
 * @returns {Octokit} Octokit 인스턴스
 */
const createGitHubClient = (accessToken) => {
  return new Octokit({
    auth: accessToken,
    userAgent: 'AIBlog/1.0.0',
  })
}

/**
 * GitHub API 공통 요청 함수
 * @param {Octokit} octokit - Octokit 인스턴스
 * @param {string} endpoint - GitHub API 엔드포인트
 * @param {object} params - 요청 파라미터
 * @returns {Promise} GitHub API 응답
 */
const makeGitHubRequest = async (octokit, endpoint, params = {}) => {
  return octokit.request(endpoint, {
    ...params,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
      ...params.headers,
    },
  })
}

/**
 * Pull Request 파일 목록 조회 및 포맷팅
 * @param {Octokit} octokit - Octokit 인스턴스
 * @param {string} owner - 저장소 소유자
 * @param {string} repo - 저장소명
 * @param {number} number - PR 번호
 * @returns {Promise<string>} 포맷된 파일 diff 내용
 */
const fetchPullRequestFiles = async (octokit, owner, repo, number) => {
  try {
    const filesResponse = await makeGitHubRequest(
      octokit,
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        owner,
        repo,
        pull_number: number,
        per_page: GITHUB_MAX_FILE_COUNT,
      }
    )

    const fileDiffs = filesResponse.data
      .slice(0, GITHUB_MAX_FILE_COUNT)
      .map((file) => {
        let diffContent = `파일: ${file.filename}\n상태: ${file.status}\n변경사항: +${file.additions}/-${file.deletions}\n`
        if (file.patch) {
          diffContent += `코드 변경:\n${file.patch}\n`
        }
        return diffContent
      })
      .join('\n---\n')

    return fileDiffs.substring(0, GITHUB_MAX_FILE_CHAR_LENGTH)
  } catch (error) {
    return ''
  }
}

/**
 * Pull Request 코멘트 조회 및 포맷팅
 * @param {Octokit} octokit - Octokit 인스턴스
 * @param {string} owner - 저장소 소유자
 * @param {string} repo - 저장소명
 * @param {number} number - PR 번호
 * @returns {Promise<string>} 포맷된 코멘트 내용
 */
const fetchPullRequestComments = async (octokit, owner, repo, number) => {
  try {
    const commentsResponse = await makeGitHubRequest(
      octokit,
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
      {
        owner,
        repo,
        pull_number: number,
        per_page: GITHUB_MAX_COMMENT_COUNT,
      }
    )

    return commentsResponse.data
      .map((comment) => `${comment.user.login}: ${comment.body}`)
      .join('\n---\n')
  } catch (error) {
    return ''
  }
}

/**
 * Repository README 조회
 * @param {Octokit} octokit - Octokit 인스턴스
 * @param {string} owner - 저장소 소유자
 * @param {string} repo - 저장소명
 * @returns {Promise<string>} README 내용
 */
const fetchRepositoryReadme = async (octokit, owner, repo) => {
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

    if (!readmeResponse.data) return ''

    if (typeof readmeResponse.data === 'string') {
      return readmeResponse.data
    }

    if (Buffer.isBuffer(readmeResponse.data)) {
      return readmeResponse.data.toString('utf-8')
    }

    return String(readmeResponse.data)
  } catch (error) {
    return ''
  }
}

/**
 * Commit 파일 변경사항 조회 및 포맷팅
 * @param {Octokit} octokit - Octokit 인스턴스
 * @param {string} owner - 저장소 소유자
 * @param {string} repo - 저장소명
 * @param {string} parentSha - 부모 commit SHA
 * @param {string} sha - 현재 commit SHA
 * @returns {Promise<string>} 포맷된 파일 diff 내용
 */
const fetchCommitFileDiffs = async (octokit, owner, repo, parentSha, sha) => {
  try {
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

    if (!compareResponse.data.files || compareResponse.data.files.length === 0) {
      return ''
    }

    const fileDiffs = compareResponse.data.files
      .slice(0, GITHUB_MAX_FILE_COUNT)
      .map((file) => {
        let diffContent = `파일: ${file.filename}\n상태: ${file.status}\n변경사항: +${file.additions}/-${file.deletions}\n`
        if (file.patch) {
          diffContent += `코드 변경:\n${file.patch}\n`
        }
        return diffContent
      })
      .join('\n---\n')

    return fileDiffs.substring(0, GITHUB_MAX_COMMIT_CHAR_LENGTH)
  } catch (error) {
    return ''
  }
}

module.exports = {
  createGitHubClient,
  makeGitHubRequest,
  fetchPullRequestFiles,
  fetchPullRequestComments,
  fetchRepositoryReadme,
  fetchCommitFileDiffs,
  GITHUB_API_VERSION,
  GITHUB_PER_PAGE,
}
