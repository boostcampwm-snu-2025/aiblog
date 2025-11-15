import express from "express";
import { generateBlog } from "./llm.controller.js";

const router = express.Router();

router.post("/generate", generateBlog);

export default router;