import express from "express";
import { generateAiPost } from "../controllers/post.js";

const router = express.Router();

// AI 블로그 포스트 생성
router.get("/ai", generateAiPost);

export default router;
