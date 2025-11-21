const express = require('express')
const { createPost, getPosts, getPostById, deletePost } = require('../controllers/postController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * 포스트 생성/저장
 * POST /api/posts
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 * 요청 바디:
 * {
 *   type: 'commit' | 'pr',
 *   typeLabel: 'Commit' | 'Pull Request',
 *   message: string (commit),
 *   title: string (pr),
 *   author: string,
 *   date: string,
 *   summary: string,
 *   status: string (pr만),
 *   number: number (pr만)
 * }
 * 응답: 생성된 포스트 정보 (id 포함)
 */
router.post('/', authMiddleware, createPost)

/**
 * 모든 포스트 조회
 * GET /api/posts
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 * 응답: createdAt 기준 최신순으로 정렬된 포스트 배열
 */
router.get('/', authMiddleware, getPosts)

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 */
router.get('/:id', authMiddleware, getPostById)

/**
 * 포스트 삭제
 * DELETE /api/posts/:id
 * 요청 헤더:
 *   - Authorization: Bearer <JWT Token>
 */
router.delete('/:id', authMiddleware, deletePost)

module.exports = router
