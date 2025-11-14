import express from "express";
import { generateBlogPost } from "../controllers/ai.js";

const router = express.Router();

// AI 블로그 포스트 생성
router.post("/post", generateBlogPost);

export default router;
