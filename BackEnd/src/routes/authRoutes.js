const express = require('express')
const passport = require('passport')
const { githubCallback, refreshTokenHandler, logout, getCurrentUser } = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * GitHub OAuth 로그인
 * 사용자를 GitHub의 인증 페이지로 리다이렉트
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

/**
 * GitHub OAuth 콜백
 * GitHub에서 인증 후 리다이렉트되는 엔드포인트
 */
router.get('/github/callback', passport.authenticate('github', { session: false }), githubCallback)

/**
 * 토큰 갱신
 * 리프레시 토큰으로 새 액세스 토큰 발급
 */
router.post('/refresh', refreshTokenHandler)

/**
 * 로그아웃
 * 리프레시 토큰 삭제
 */
router.post('/logout', logout)

/**
 * 현재 사용자 정보 조회
 * 인증된 요청만 가능
 */
router.get('/me', authMiddleware, getCurrentUser)

module.exports = router
