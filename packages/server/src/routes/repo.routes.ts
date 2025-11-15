import { Router } from "express";
import {
  getCommits,
  getPullRequests,
  generatePRSummary,
} from "../controllers/repo.controller";

const router = Router();

router.get("/commits", getCommits);
router.get("/pulls", getPullRequests);
router.post("/generate-pr-summary", generatePRSummary);

export default router;
