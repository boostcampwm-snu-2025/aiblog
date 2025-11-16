const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 커밋 정보를 기반으로 블로그 글 생성
 * @param {Object} commitData - 커밋 정보
 * @returns {Promise<Object>} 생성된 블로그 글 { title, content }
 */
async function generateBlogFromCommit(commitData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
아래 GitHub 커밋 정보를 바탕으로 기술 블로그 글을 작성해주세요.

커밋 정보:
- 메시지: ${commitData.message}
- 작성자: ${commitData.author}
- 날짜: ${commitData.date}

요구사항:
1. 매력적이고 SEO 친화적인 제목 작성
2. 이 커밋에서 수행한 작업을 기술적으로 설명
3. 코드 변경의 의도와 배경 설명
4. 개발 과정에서 배운 점이나 인사이트 포함
5. Markdown 형식으로 작성
6. 제목은 "# " 으로 시작하는 하나의 H1 태그만 사용
7. 본문은 적절한 소제목(##, ###)으로 구조화
8. 코드 예시가 필요하면 코드 블록 사용

응답 형식:
제목과 본문을 모두 포함한 완전한 Markdown 형식의 블로그 글을 작성해주세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullContent = response.text();

    // 제목과 본문 분리
    const lines = fullContent.split('\n');
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : '기술 블로그';

    return {
      title,
      content: fullContent,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating blog from commit:', error);
    throw new Error('Failed to generate blog post');
  }
}

/**
 * PR 정보를 기반으로 블로그 글 생성
 * @param {Object} prData - PR 정보
 * @returns {Promise<Object>} 생성된 블로그 글 { title, content }
 */
async function generateBlogFromPR(prData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
아래 GitHub Pull Request 정보를 바탕으로 기술 블로그 글을 작성해주세요.

PR 정보:
- 제목: ${prData.title}
- 설명: ${prData.body || '설명 없음'}
- 작성자: ${prData.author}
- 날짜: ${prData.date}
- 상태: ${prData.state}

요구사항:
1. 매력적이고 SEO 친화적인 제목 작성
2. 이 PR에서 구현한 기능이나 수정사항을 기술적으로 설명
3. 변경의 배경과 필요성 설명
4. 구현 과정에서의 기술적 고민과 해결 방법
5. 팀 협업이나 코드 리뷰 과정에서 배운 점
6. Markdown 형식으로 작성
7. 제목은 "# " 으로 시작하는 하나의 H1 태그만 사용
8. 본문은 적절한 소제목(##, ###)으로 구조화
9. 코드 예시가 필요하면 코드 블록 사용

응답 형식:
제목과 본문을 모두 포함한 완전한 Markdown 형식의 블로그 글을 작성해주세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullContent = response.text();

    // 제목과 본문 분리
    const lines = fullContent.split('\n');
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : '기술 블로그';

    return {
      title,
      content: fullContent,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating blog from PR:', error);
    throw new Error('Failed to generate blog post');
  }
}

/**
 * 활동 정보(커밋 or PR)를 기반으로 블로그 글 생성
 * @param {Object} activityData - 활동 정보
 * @returns {Promise<Object>} 생성된 블로그 글
 */
async function generateBlogPost(activityData) {
  if (activityData.type === 'commit') {
    return await generateBlogFromCommit(activityData);
  } else if (activityData.type === 'pull_request') {
    return await generateBlogFromPR(activityData);
  } else {
    throw new Error('Unsupported activity type');
  }
}

module.exports = {
  generateBlogPost,
  generateBlogFromCommit,
  generateBlogFromPR
};
