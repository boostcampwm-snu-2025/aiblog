const express = require("express");
const blog = require("../models/blog");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* ===========================
   1) LLM 블로그 생성 (기존 기능) 
=========================== */
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

/* ===========================
   2) 블로그 생성 (DB 저장)
=========================== */
router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===========================
   3) 전체 블로그 조회
=========================== */
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

/* ===========================
   4) 특정 블로그 조회
=========================== */
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

/* ===========================
   5) 블로그 수정
=========================== */
router.put("/:id", async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

/* ===========================
   6) 블로그 삭제
=========================== */
router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
