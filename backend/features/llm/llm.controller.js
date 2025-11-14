import { createBlogPost } from "./llm.service.js";

export const generateBlog = async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "content is required" });
  }

  try {
    const result = await createBlogPost(title, content);
    res.json({ result });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "LLM 요청 실패", detail: err.message });
  }
};