const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || '7d'
const JWT_REFRESH_EXPIRE_IN = process.env.JWT_REFRESH_EXPIRE_IN || '30d'

/**
 * 액세스 토큰 생성
 */
const generateAccessToken = (payload) => {
  const options = {
    expiresIn: JWT_EXPIRE_IN,
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

/**
 * 리프레시 토큰 생성
 */
const generateRefreshToken = (githubId) => {
  const options = {
    expiresIn: JWT_REFRESH_EXPIRE_IN,
  }
  return jwt.sign({ githubId }, JWT_SECRET, options)
}

/**
 * 토큰 검증 및 디코딩
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * 리프레시 토큰 검증
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * 토큰에서 만료 시간 가져오기 (초 단위)
 */
const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (decoded && decoded.exp) {
      return decoded.exp - Math.floor(Date.now() / 1000)
    }
    return 0
  } catch (error) {
    return 0
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  getTokenExpiry,
}
