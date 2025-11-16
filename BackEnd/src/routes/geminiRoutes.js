const express = require('express')
const { generateSummary } = require('../controllers/geminiController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * Commit 또는 PR의 요약 생성
 * POST /api/gemini/summary
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 * 요청 바디:
 *   - type: 'commit' | 'pr'
 *   - data: commit/pr 정보 객체
 * 응답: { summary: string }
 */
router.post('/summary', authMiddleware, generateSummary)

module.exports = router
