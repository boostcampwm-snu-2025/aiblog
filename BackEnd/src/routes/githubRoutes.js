const express = require('express')
const { getRepositories, getCommits, getPullRequests, getPullRequestDetails, getCommitDetails } = require('../controllers/githubController')
const { authMiddleware, githubTokenMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * 사용자의 GitHub 저장소 목록 조회 (소유 + Collaborator)
 * GET /api/github/repositories
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 *   - X-GitHub-Token: <GitHub Access Token>
 * 응답: 사용자가 소유한 리포지토리 + Collaborator 리포지토리
 * private, public 모두 포함
 */
router.get('/repositories', authMiddleware, githubTokenMiddleware, getRepositories)

/**
 * 저장소의 커밋 목록 조회
 * GET /api/github/commits?owner=repository-owner&repo=repository-name
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 *   - X-GitHub-Token: <GitHub Access Token>
 * 응답: 최근 10개의 커밋 정보
 */
router.get('/commits', authMiddleware, githubTokenMiddleware, getCommits)

/**
 * 저장소의 Pull Requests 목록 조회
 * GET /api/github/pulls?owner=repository-owner&repo=repository-name
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 *   - X-GitHub-Token: <GitHub Access Token>
 * 응답: 모든 상태(open, closed, merged)의 PR 정보
 */
router.get('/pulls', authMiddleware, githubTokenMiddleware, getPullRequests)

/**
 * PR 상세 정보 조회 (본문, 코멘트, README 포함)
 * GET /api/github/pull/:owner/:repo/:number/details
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 *   - X-GitHub-Token: <GitHub Access Token>
 * 응답: { body, comments, readme }
 */
router.get('/pull/:owner/:repo/:number/details', authMiddleware, githubTokenMiddleware, getPullRequestDetails)

/**
 * Commit 상세 정보 조회 (파일 diff 포함)
 * GET /api/github/commit/:owner/:repo/:sha/details
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 *   - X-GitHub-Token: <GitHub Access Token>
 * 응답: { files }
 */
router.get('/commit/:owner/:repo/:sha/details', authMiddleware, githubTokenMiddleware, getCommitDetails)

module.exports = router
