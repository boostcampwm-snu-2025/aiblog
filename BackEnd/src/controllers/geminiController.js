const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const generateSummary = async (req, res) => {
  try {
    const { type, data } = req.body

    if (!type || !data) {
      return res.status(400).json({ error: '타입과 데이터는 필수입니다' })
    }

    // 타입에 따른 프롬프트 생성
    let prompt = ''
    if (type === 'commit') {
      const { message, author, date, sha } = data
      prompt = `
다음 Git commit의 내용을 간단히 요약해줘. 한국어로 2-3문장으로 작성해줘.

Commit Message: ${message}
Author: ${author}
Date: ${date}
SHA: ${sha || 'N/A'}

요약:
      `.trim()
    } else if (type === 'pr') {
      const { title, author, date, status, number } = data
      prompt = `
다음 GitHub Pull Request의 내용을 간단히 요약해줘. 한국어로 2-3문장으로 작성해줘.

PR Title: ${title}
PR Number: #${number || 'N/A'}
Author: ${author}
Status: ${status || 'Unknown'}
Date: ${date}

요약:
      `.trim()
    } else {
      return res.status(400).json({ error: '유효하지 않은 타입입니다' })
    }

    // Gemini API 호출
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    res.json({ summary })
  } catch (error) {
    console.error('Gemini API 오류:', error)
    res.status(500).json({ error: '요약 생성 중 오류가 발생했습니다' })
  }
}

module.exports = {
  generateSummary
}
