import { Router } from "express";
import {
  getCommits,
  getPullRequests,
  generatePRSummary,
  generateBlogPost,
  getAllBlogPosts,
  getBlogPosts,
  saveBlogPost,
} from "../controllers/repo.controller";

const router = Router();

router.get("/commits", getCommits);
router.get("/pulls", getPullRequests);
router.post("/generate-pr-summary", generatePRSummary);
router.post("/generate-blog-post", generateBlogPost);
router.get("/blog-posts/all", getAllBlogPosts);
router.get("/blog-posts", getBlogPosts);
router.post("/save-blog-post", saveBlogPost);

export default router;
