const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다.');
}

/**
 * POST /api/llm/generate
 * React 클라이언트로부터 GitHub 아이템 정보(커밋 메시지 등)를 받아
 * Gemini API로 블로그 글 생성을 요청합니다.
 */
router.post('/generate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ message: 'LLM 서비스가 설정되지 않았습니다.' });
  }

  // 1. React에서 보낸 데이터 (커밋 메시지, PR 제목 등)
  const { itemType, content, author } = req.body;

  // 2. Gemini API에 보낼 프롬프트 생성
  const prompt = `
    당신은 전문 개발 기술 블로거입니다.
    다음 GitHub ${itemType === 'commit' ? '커밋' : 'PR'} 정보를 바탕으로, 이 작업의 중요성과 내용을 설명하는 짧은 블로그 포스트를 한국어로 작성해주세요.
    독자들이 이해하기 쉽고 흥미를 느낄 수 있게 작성해주세요.

    - 작성자: ${author}
    - ${itemType === 'commit' ? '커밋 메시지' : 'PR 제목'}: ${content}

    ---
    (블로그 포스트 시작)
  `;

  // 3. Gemini API 호출 페이로드
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      throw new Error(`Gemini API Error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    
    // 4. 생성된 텍스트 추출 및 React로 전송
    const blogContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (blogContent) {
      res.json({ blogContent });
    } else {
      throw new Error('LLM에서 유효한 응답을 받지 못했습니다.');
    }

  } catch (error) {
    console.error('Error generating blog post:', error);
    res.status(500).json({ message: '블로그 생성 중 오류가 발생했습니다.' });
  }
});

module.exports = router;