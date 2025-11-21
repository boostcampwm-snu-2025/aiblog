const express = require("express");
const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { commitMessage, diff } = req.body;

    const prompt = `
    아래 GitHub 작업을 기반으로 기술 블로그 글을 작성해줘.
    - 커밋 메시지: ${commitMessage}
    - 변경 내용(diff): ${diff}

    블로그 형식:
    1) 문제 상황
    2) 해결 과정
    3) 코드 설명
    4) 배운 점
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    //  실패 처리
    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res
        .status(500)
        .json({ error: "OpenAI request failed", detail: data });
    }

    //  응답 안전하게 읽기
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Unexpected LLM response:", data);
      return res
        .status(500)
        .json({ error: "Invalid OpenAI API response", detail: data });
    }

    return res.json({ blog: content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Blog generation failed" });
  }
});

console.log("ENV OPENAI KEY:", process.env.OPENAI_API_KEY);

module.exports = router;
