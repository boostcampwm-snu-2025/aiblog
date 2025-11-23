const { GoogleGenerativeAI } = require('@google/generative-ai')

// Constants
const GEMINI_MODEL_NAME = 'gemini-2.5-flash-lite'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Commit 프롬프트 생성
 * @param {Object} data - Commit 데이터
 * @returns {string} 생성된 프롬프트
 */
const generateCommitPrompt = (data) => {
  const { message, files } = data

  return `다음 Git commit의 내용을 간단히 요약해줘. 한국어로 2-3문장으로 작성해줘.
반드시 변경된 파일과 코드 내용을 기반으로 요약해줘.
Commit Message만으로는 충분하지 않고, 실제 코드 변경사항을 분석해야 해.
헤더나 제목 없이 요약 본문만 반환해줘.

=== Commit 메시지 ===
${message}

=== 변경된 파일 및 코드 내용 (필수 분석 대상) ===
${files || '파일 변경사항 없음'}

요약:`.trim()
}

/**
 * Pull Request 프롬프트 생성
 * @param {Object} data - PR 데이터
 * @returns {string} 생성된 프롬프트
 */
const generatePRPrompt = (data) => {
  const { title, date, status, number, body, files, comments, readme } = data

  return `다음 GitHub Pull Request의 내용을 상세히 요약해줘. 한국어로 3-5문장으로 작성해줘.
PR의 목적, 주요 변경 사항, 코드 내용, 그리고 영향을 분석해서 설명해줘.
헤더나 제목 없이 요약 본문만 반환해줘.

=== PR 기본 정보 ===
PR Title: ${title}
PR Number: #${number || 'N/A'}
Status: ${status || 'Unknown'}
Date: ${date}

${body ? `=== PR 본문 설명 ===\n${body.substring(0, 1500)}\n` : ''}

${files ? `=== 변경된 파일 및 코드 ===\n${files}\n` : ''}

${comments ? `=== PR 토론 내용 (모든 코멘트) ===\n${comments}\n` : ''}

${readme ? `=== 저장소 README ===\n${readme}\n` : ''}`.trim()
}

/**
 * Gemini API를 통해 요약 생성
 * @param {string} prompt - 프롬프트
 * @returns {Promise<string>} 생성된 요약
 */
const callGeminiAPI = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME })
  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * 요약 생성 메인 함수
 * POST /api/gemini/summary
 */
const generateSummary = async (req, res) => {
  try {
    const { type, data } = req.body

    // Early return: 필수 검증
    if (!type || !data) {
      return res.status(400).json({ error: '타입과 데이터는 필수입니다' })
    }

    // Early return: 유효한 타입 확인
    if (type !== 'commit' && type !== 'pr') {
      return res.status(400).json({ error: '유효하지 않은 타입입니다' })
    }

    // 타입별 프롬프트 생성
    const prompt = type === 'commit'
      ? generateCommitPrompt(data)
      : generatePRPrompt(data)

    // Gemini API 호출 및 요약 생성
    const summary = await callGeminiAPI(prompt)

    res.json({ summary })
  } catch (error) {
    res.status(500).json({ error: '요약 생성 중 오류가 발생했습니다' })
  }
}

module.exports = {
  generateSummary
}
