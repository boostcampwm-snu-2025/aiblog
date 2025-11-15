import { Router } from "express";
import {
  getCommits,
  getPullRequests,
  generatePRSummary,
  generateBlogPost,
} from "../controllers/repo.controller";

const router = Router();

router.get("/commits", getCommits);
router.get("/pulls", getPullRequests);
router.post("/generate-pr-summary", generatePRSummary);
router.post("/generate-blog-post", generateBlogPost);

export default router;
