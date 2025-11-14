import express from "express";
import {
  getCommits,
  getPRs,
  getMyRepos,
  getPRDetail,
} from "./github.controller.js";

const router = express.Router();

router.get("/commits", getCommits);
router.get("/prs", getPRs);
router.get("/repos", getMyRepos);
router.get("/pr-detail/:number", getPRDetail);

export default router;