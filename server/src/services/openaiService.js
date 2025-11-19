import OpenAI from 'openai';

/**
 * OpenAI Service for blog generation
 */

// Initialize OpenAI client
const initializeOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
};

/**
 * Generate blog content from commit data
 * @param {Object} commitData - Detailed commit information
 * @param {string} repoName - Repository name
 * @returns {Promise<string>} Generated blog content in markdown
 */
export const generateBlogFromCommit = async (commitData, repoName) => {
  try {
    const openai = initializeOpenAI();
    
    // Prepare commit information for the prompt
    const filesInfo = commitData.files
      .map(file => `- ${file.filename} (${file.status}): +${file.additions} -${file.deletions}`)
      .join('\n');
    
    const diffSummary = commitData.files
      .filter(file => file.patch)
      .map(file => `### ${file.filename}\n\`\`\`diff\n${file.patch.slice(0, 500)}${file.patch.length > 500 ? '...' : ''}\n\`\`\``)
      .join('\n\n');
    
    const prompt = `당신은 개발자의 작업 일지를 작성하는 기술 블로거입니다. 
다음 GitHub 커밋 정보를 바탕으로 개발 일지 형식의 블로그 글을 작성해주세요.

## 커밋 정보
- Repository: ${repoName}
- Commit SHA: ${commitData.sha}
- Author: ${commitData.author.name} (${commitData.author.login || commitData.author.email})
- Date: ${commitData.author.date}
- Commit Message: ${commitData.message}

## 변경 통계
- 추가된 라인: ${commitData.stats.additions}
- 삭제된 라인: ${commitData.stats.deletions}
- 변경된 파일 수: ${commitData.files.length}

## 변경된 파일 목록
${filesInfo}

## 주요 변경 사항 (Diff)
${diffSummary}

작성 요구사항:
1. 개발 일지 톤으로 작성 (친근하고 기술적)
2. 마크다운 형식으로 작성
3. 제목은 커밋 메시지를 기반으로
4. 변경 사항의 의도와 목적을 설명
5. 기술적 세부사항 포함
6. 다음 섹션 포함: 개요, 변경 사항, 기술적 고려사항, 마무리

한국어로 작성해주세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 개발자의 작업을 이해하고 명확하게 설명하는 기술 블로거입니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate blog from commit: ${error.message}`);
  }
};

/**
 * Generate blog content from pull request data
 * @param {Object} prData - Detailed pull request information
 * @param {string} repoName - Repository name
 * @returns {Promise<string>} Generated blog content in markdown
 */
export const generateBlogFromPR = async (prData, repoName) => {
  try {
    const openai = initializeOpenAI();
    
    // Prepare PR information for the prompt
    const filesInfo = prData.files
      .map(file => `- ${file.filename} (${file.status}): +${file.additions} -${file.deletions}`)
      .join('\n');
    
    const diffSummary = prData.files
      .slice(0, 5) // Limit to first 5 files
      .filter(file => file.patch)
      .map(file => `### ${file.filename}\n\`\`\`diff\n${file.patch.slice(0, 500)}${file.patch.length > 500 ? '...' : ''}\n\`\`\``)
      .join('\n\n');
    
    const commentsInfo = prData.comments.length > 0
      ? prData.comments.slice(0, 10).map(c => `- ${c.user}: ${c.body.substring(0, 200)}`).join('\n')
      : '코멘트 없음';
    
    const prompt = `당신은 개발자의 작업 일지를 작성하는 기술 블로거입니다. 
다음 GitHub Pull Request 정보를 바탕으로 개발 일지 형식의 블로그 글을 작성해주세요.

## PR 정보
- Repository: ${repoName}
- PR #${prData.number}: ${prData.title}
- Author: ${prData.user.login}
- Status: ${prData.state}${prData.merged_at ? ' (Merged)' : ''}
- Created: ${prData.created_at}
${prData.merged_at ? `- Merged: ${prData.merged_at}` : ''}
- Branch: ${prData.head.ref} → ${prData.base.ref}

## PR 설명
${prData.body || '설명 없음'}

## 변경 통계
- 추가된 라인: ${prData.stats.additions}
- 삭제된 라인: ${prData.stats.deletions}
- 변경된 파일 수: ${prData.stats.changed_files}

## 변경된 파일 목록
${filesInfo}

## 주요 변경 사항 (Diff)
${diffSummary}

## 리뷰 코멘트
${commentsInfo}

작성 요구사항:
1. 개발 일지 톤으로 작성 (친근하고 기술적)
2. 마크다운 형식으로 작성
3. 제목은 PR 제목을 기반으로
4. PR의 목적과 해결하려는 문제 설명
5. 주요 변경 사항과 기술적 접근 방법
6. 다음 섹션 포함: 개요, 문제 정의, 해결 방법, 구현 세부사항, 결과 및 마무리

한국어로 작성해주세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 개발자의 작업을 이해하고 명확하게 설명하는 기술 블로거입니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate blog from PR: ${error.message}`);
  }
};
