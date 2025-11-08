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

module.exports = { authMiddleware }
