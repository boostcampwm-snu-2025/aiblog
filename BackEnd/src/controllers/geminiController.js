const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const generateSummary = async (req, res) => {
  try {
    const { type, data } = req.body

    console.log('=== Gemini API 수신 데이터 ===')
    console.log('Type:', type)
    console.log('Data keys:', Object.keys(data))

    if (!type || !data) {
      return res.status(400).json({ error: '타입과 데이터는 필수입니다' })
    }

    // 타입에 따른 프롬프트 생성
    let prompt = ''
    if (type === 'commit') {
      const { message, author, date, sha, files } = data
      console.log('Commit 상세 데이터:')
      console.log('- Message 길이:', message ? message.length : 0)
      console.log('- Files 길이:', files ? files.length : 0)

      prompt = `다음 Git commit의 내용을 간단히 요약해줘. 한국어로 2-3문장으로 작성해줘.
반드시 변경된 파일과 코드 내용을 기반으로 요약해줘.
Commit Message만으로는 충분하지 않고, 실제 코드 변경사항을 분석해야 해.
헤더나 제목 없이 요약 본문만 반환해줘.

=== Commit 메시지 ===
${message}

=== 변경된 파일 및 코드 내용 (필수 분석 대상) ===
${files ? files : '파일 변경사항 없음'}

요약:`.trim()
    } else if (type === 'pr') {
      const { title, author, date, status, number, body, files, comments, readme } = data
      console.log('PR 상세 데이터:')
      console.log('- Title:', title)
      console.log('- Number:', number)
      console.log('- Body 길이:', body ? body.length : 0)
      console.log('- Files 길이:', files ? files.length : 0)
      console.log('- Comments 길이:', comments ? comments.length : 0)
      console.log('- README 길이:', readme ? readme.length : 0)
      console.log('Files 샘플:', files ? files.substring(0, 200) : '없음')
      console.log('Comments 샘플:', comments ? comments.substring(0, 200) : '없음')
      console.log('README 샘플:', readme ? readme.substring(0, 200) : '없음')

      prompt = `다음 GitHub Pull Request의 내용을 상세히 요약해줘. 한국어로 3-5문장으로 작성해줘.
PR의 목적, 주요 변경 사항, 코드 내용, 그리고 영향을 분석해서 설명해줘.
헤더나 제목 없이 요약 본문만 반환해줘.

=== PR 기본 정보 ===
PR Title: ${title}
PR Number: #${number || 'N/A'}
Author: ${author}
Status: ${status || 'Unknown'}
Date: ${date}

${body ? `=== PR 본문 설명 ===\n${body.substring(0, 1500)}\n` : ''}

${files ? `=== 변경된 파일 및 코드 ===\n${files}\n` : ''}

${comments ? `=== PR 토론 내용 (모든 코멘트) ===\n${comments}\n` : ''}

${readme ? `=== 저장소 README ===\n${readme}\n` : ''}`.trim()
    } else {
      return res.status(400).json({ error: '유효하지 않은 타입입니다' })
    }

    console.log('=== Gemini 프롬프트 ===')
    console.log(prompt)
    console.log('=== 프롬프트 길이:', prompt.length)

    // Gemini API 호출
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    console.log('=== 생성된 요약 ===')
    console.log(summary)

    res.json({ summary })
  } catch (error) {
    console.error('Gemini API 오류:', error)
    res.status(500).json({ error: '요약 생성 중 오류가 발생했습니다' })
  }
}

module.exports = {
  generateSummary
}
