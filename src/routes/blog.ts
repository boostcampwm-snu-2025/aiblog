import { Router } from 'express';
import { getCommitDetails, getRepositoryInfo } from '../services/github';
import { generateBlogFromCommit } from '../services/llm';
import {
  publishBlog,
  getBlogList,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '../services/blogStorage';

const router = Router();

/**
 * POST /api/blog/generate
 * 커밋 정보를 기반으로 블로그를 생성합니다.
 */
router.post('/generate', async (req, res) => {
  const { owner, repo, commitSha } = req.body;

  // 입력 검증
  if (!owner || !repo || !commitSha) {
    return res.status(400).json({
      success: false,
      error: 'owner, repo, commitSha는 필수 입력값입니다.',
    });
  }

  try {
    // 세션에서 GitHub 토큰 가져오기
    const token = (req.session as any).ghToken as string | undefined;

    // 1. 커밋 상세 정보 가져오기
    const commitDetails = await getCommitDetails(owner, repo, commitSha, token);

    // 2. 저장소 정보 가져오기 (선택)
    let repoInfo;
    try {
      repoInfo = await getRepositoryInfo(owner, repo, token);
    } catch (error) {
      console.warn('저장소 정보 가져오기 실패, 계속 진행합니다:', error);
    }

    // 3. LLM을 사용하여 블로그 생성
    const blogContent = await generateBlogFromCommit({
      commitMessage: commitDetails.message,
      commitDiff: commitDetails.diff,
      filesChanged: commitDetails.filesChanged,
      repoName: repoInfo?.name,
      repoDescription: repoInfo?.description || undefined,
    });

    // 4. 응답 반환
    res.json({
      success: true,
      data: {
        title: blogContent.title,
        content: blogContent.content,
        summary: blogContent.summary,
        metadata: {
          commitSha: commitDetails.sha,
          author: commitDetails.author,
          date: commitDetails.date,
          filesChanged: commitDetails.filesChanged,
          stats: commitDetails.stats,
        },
      },
    });
  } catch (error: any) {
    console.error('블로그 생성 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 생성 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

/**
 * POST /api/blog/publish
 * 생성된 블로그를 게시합니다.
 */
router.post('/publish', async (req, res) => {
  const { title, content, summary, commitSha, owner, repo, author, filesChanged, stats } = req.body;

  // 입력 검증
  if (!title || !content || !commitSha || !owner || !repo || !author) {
    return res.status(400).json({
      success: false,
      error: 'title, content, commitSha, owner, repo, author는 필수 입력값입니다.',
    });
  }

  try {
    const publishedBlog = publishBlog({
      title,
      content,
      summary,
      commitSha,
      owner,
      repo,
      author,
      filesChanged: filesChanged || [],
      stats: stats || { additions: 0, deletions: 0, total: 0 },
    });

    res.json({
      success: true,
      data: publishedBlog,
    });
  } catch (error: any) {
    console.error('블로그 게시 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 게시 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

/**
 * GET /api/blog/list
 * 게시된 블로그 목록을 조회합니다.
 */
router.get('/list', async (req, res) => {
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.per_page || 10);

  try {
    const result = getBlogList({ page, perPage, publishedOnly: true });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('블로그 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 목록 조회 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

/**
 * GET /api/blog/:id
 * 특정 블로그를 조회합니다.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = getBlogById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: '블로그를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error('블로그 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 조회 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

/**
 * PUT /api/blog/:id
 * 블로그를 수정합니다.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedBlog = updateBlog(id, updates);

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        error: '블로그를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error: any) {
    console.error('블로그 수정 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 수정 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

/**
 * DELETE /api/blog/:id
 * 블로그를 삭제합니다.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = deleteBlog(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: '블로그를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      message: '블로그가 삭제되었습니다.',
    });
  } catch (error: any) {
    console.error('블로그 삭제 실패:', error);
    res.status(500).json({
      success: false,
      error: '블로그 삭제 중 오류가 발생했습니다.',
      detail: error?.message,
    });
  }
});

export default router;
