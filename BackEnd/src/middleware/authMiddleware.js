const { verifyToken, extractBearerToken } = require('../utils/tokenUtils')
const { sendUnauthorized, handleError } = require('../utils/errorHandler')

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 토큰을 추출하여 검증
 */
const authMiddleware = (req, res, next) => {
  try {
    console.log('=== authMiddleware 검증 시작 ===')
    console.log('요청 경로:', req.path)
    console.log('Authorization 헤더:', req.headers.authorization ? '있음' : '없음')

    const authHeader = req.headers.authorization
    const token = extractBearerToken(authHeader)

    if (!token) {
      console.log('토큰 추출 실패')
      return sendUnauthorized(res, 'Missing or invalid authorization header')
    }

    const user = verifyToken(token)

    if (!user) {
      console.log('토큰 검증 실패')
      return sendUnauthorized(res, 'Invalid or expired token')
    }

    console.log('토큰 검증 성공, 사용자:', user.id)
    req.user = user
    next()
  } catch (error) {
    console.error('authMiddleware 에러:', error)
    return handleError(error, res, 'Authentication error', 500)
  }
}

/**
 * GitHub 토큰 검증 미들웨어
 * X-GitHub-Token 헤더에서 GitHub 액세스 토큰을 검증
 */
const githubTokenMiddleware = (req, res, next) => {
  try {
    console.log('=== githubTokenMiddleware 검증 시작 ===')
    console.log('요청 경로:', req.path)
    console.log('X-GitHub-Token 헤더:', req.headers['x-github-token'] ? '있음' : '없음')

    const githubToken = req.headers['x-github-token']

    if (!githubToken) {
      console.log('GitHub 토큰 누락')
      return sendUnauthorized(res, 'GitHub access token not found. Please provide X-GitHub-Token header')
    }

    console.log('GitHub 토큰 헤더 검증 성공')
    // 토큰이 있으면 다음 미들웨어로 진행
    // 실제 검증은 GitHub API 호출 시 이루어짐
    next()
  } catch (error) {
    console.error('githubTokenMiddleware 에러:', error)
    return handleError(error, res, 'GitHub token validation error', 500)
  }
}

module.exports = { authMiddleware, githubTokenMiddleware }
