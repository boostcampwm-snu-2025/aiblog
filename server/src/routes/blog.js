const express = require('express');
const { generateBlogPost } = require('../services/llmService');

const router = express.Router();

/**
 * @swagger
 * /api/blog/generate:
 *   post:
 *     summary: AI 블로그 글 생성
 *     description: 커밋 또는 PR 정보를 받아서 LLM(Gemini)으로 블로그 글을 자동 생성합니다
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - author
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [commit, pull_request]
 *                 description: 활동 타입
 *                 example: commit
 *               id:
 *                 type: string
 *                 description: 활동 ID (커밋 SHA 또는 PR 번호)
 *                 example: abc123def456
 *               message:
 *                 type: string
 *                 description: 커밋 메시지 (type이 commit일 때 필수)
 *                 example: Feat: Add login feature
 *               title:
 *                 type: string
 *                 description: PR 제목 (type이 pull_request일 때 필수)
 *                 example: Add user authentication
 *               body:
 *                 type: string
 *                 description: PR 본문
 *                 example: This PR implements user authentication using JWT
 *               author:
 *                 type: string
 *                 description: 작성자 이름
 *                 example: John Doe
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 작성 날짜
 *                 example: 2025-11-16T10:00:00Z
 *               url:
 *                 type: string
 *                 description: GitHub URL
 *                 example: https://github.com/user/repo/commit/abc123
 *     responses:
 *       200:
 *         description: 블로그 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: 생성된 블로그 제목
 *                       example: GitHub 활동 내역, 한눈에 확인하세요!
 *                     content:
 *                       type: string
 *                       description: 생성된 블로그 본문 (Markdown 형식)
 *                       example: "# 블로그 제목\n\n본문 내용..."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 블로그 생성 시각
 *                       example: 2025-11-16T10:05:00Z
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *                 message:
 *                   type: string
 *                   example: Activity type is required (commit or pull_request)
 *       429:
 *         description: API 호출 제한 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Rate Limit Exceeded
 *                 message:
 *                   type: string
 *                   example: Too many requests. Please try again later.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *                 message:
 *                   type: string
 *                   example: Failed to generate blog post
 */
router.post('/generate', async (req, res) => {
  try {
    const activityData = req.body;

    // 요청 데이터 검증
    if (!activityData) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Activity data is required'
      });
    }

    if (!activityData.type) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Activity type is required (commit or pull_request)'
      });
    }

    if (!['commit', 'pull_request'].includes(activityData.type)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid activity type. Must be "commit" or "pull_request"'
      });
    }

    // 커밋 타입 검증
    if (activityData.type === 'commit') {
      if (!activityData.message) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Commit message is required for commit type'
        });
      }
    }

    // PR 타입 검증
    if (activityData.type === 'pull_request') {
      if (!activityData.title) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'PR title is required for pull_request type'
        });
      }
    }

    console.log('📝 블로그 생성 요청:', {
      type: activityData.type,
      id: activityData.id,
      author: activityData.author
    });

    // LLM으로 블로그 생성
    const blogPost = await generateBlogPost(activityData);

    console.log('✅ 블로그 생성 완료:', blogPost.title);

    res.json({
      success: true,
      data: blogPost
    });

  } catch (error) {
    console.error('❌ 블로그 생성 중 에러 발생:', error);

    // Gemini API 에러 처리
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'API Configuration Error',
        message: 'Gemini API key is not configured properly'
      });
    }

    // Rate Limit 에러
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    // 일반 에러
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate blog post'
    });
  }
});

module.exports = router;
