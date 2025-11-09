const { verifyToken } = require('../utils/tokenUtils')

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 토큰을 추출하여 검증
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization header',
      })
    }

    const token = authHeader.substring(7)
    const user = verifyToken(token)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    })
  }
}

/**
 * GitHub 토큰 검증 미들웨어
 * X-GitHub-Token 헤더에서 GitHub 액세스 토큰을 검증
 */
const githubTokenMiddleware = (req, res, next) => {
  try {
    const githubToken = req.headers['x-github-token']

    if (!githubToken) {
      return res.status(401).json({
        success: false,
        message: 'GitHub access token not found. Please provide X-GitHub-Token header',
      })
    }

    // 토큰이 있으면 다음 미들웨어로 진행
    // 실제 검증은 GitHub API 호출 시 이루어짐
    next()
  } catch (error) {
    console.error('GitHub token middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'GitHub token validation error',
    })
  }
}

module.exports = { authMiddleware, githubTokenMiddleware }
