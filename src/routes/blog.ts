import { Router } from 'express';
import { getCommitDetails, getRepositoryInfo } from '../services/github';
import { generateBlogFromCommit } from '../services/llm';

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

export default router;
