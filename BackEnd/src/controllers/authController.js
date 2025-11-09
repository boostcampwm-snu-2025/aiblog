const { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiry } = require('../utils/tokenUtils')
const { tokenStore } = require('../services/tokenService')
const { add } = require('date-fns')

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

/**
 * GitHub OAuth 콜백 핸들러
 * GitHub에서 인증 후 리다이렉트되는 엔드포인트
 */
const githubCallback = (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      })
      return
    }

    const user = req.user

    // 액세스 토큰 생성
    const accessToken = generateAccessToken(user)

    // 리프레시 토큰 생성
    const refreshToken = generateRefreshToken(user.id)

    // 리프레시 토큰 저장 (30일 유효)
    const refreshTokenExpiry = add(new Date(), { days: 30 })
    tokenStore.saveRefreshToken(refreshToken, {
      githubId: user.id,
      expiresAt: refreshTokenExpiry,
    })

    // 액세스 토큰 만료 시간 (초)
    const expiresIn = getTokenExpiry(accessToken)

    // 프론트엔드로 리다이렉트 (토큰 전달)
    const redirectUrl = new URL(`${FRONTEND_URL}/auth/callback`)
    redirectUrl.searchParams.append('accessToken', accessToken)
    redirectUrl.searchParams.append('refreshToken', refreshToken)
    redirectUrl.searchParams.append('expiresIn', expiresIn.toString())
    redirectUrl.searchParams.append('githubAccessToken', user.githubAccessToken)

    res.redirect(redirectUrl.toString())
  } catch (error) {
    console.error('GitHub callback error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    })
  }
}

/**
 * 토큰 갱신
 * 리프레시 토큰으로 새 액세스 토큰 발급
 */
const refreshTokenHandler = (req, res) => {
  try {
    const { refreshToken: token } = req.body

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      })
      return
    }

    // 리프레시 토큰 검증
    const decoded = verifyRefreshToken(token)

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      })
      return
    }

    // 저장된 리프레시 토큰 확인
    const tokenData = tokenStore.getRefreshToken(token)

    if (!tokenData) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      })
      return
    }

    // 새 액세스 토큰 생성
    const newAccessToken = generateAccessToken({
      id: decoded.githubId,
      login: '', // GitHub ID만 가지고 있으므로 빈값으로 설정
      email: null,
      avatar_url: '',
    })

    const expiresIn = getTokenExpiry(newAccessToken)

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn,
      },
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      message: 'Token refresh error',
    })
  }
}

/**
 * 로그아웃
 * 리프레시 토큰 삭제
 */
const logout = (req, res) => {
  try {
    const { refreshToken: token } = req.body

    if (token) {
      tokenStore.deleteRefreshToken(token)
    }

    if (req.user) {
      // 해당 사용자의 모든 토큰 삭제 (완전 로그아웃)
      tokenStore.deleteUserTokens(req.user.id)
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Logout error',
    })
  }
}

/**
 * 현재 사용자 정보 조회
 */
const getCurrentUser = (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      })
      return
    }

    res.json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
    })
  }
}

module.exports = {
  githubCallback,
  refreshTokenHandler,
  logout,
  getCurrentUser,
}
