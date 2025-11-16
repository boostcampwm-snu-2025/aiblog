import express from "express";
import { getPRCommits, getPRDetail, getPRList } from "../controllers/github.js";

const router = express.Router();

// PR 목록 조회
router.get("/repos/:owner/:repo/pulls", getPRList);

// PR 상세 정보 조회
router.get("/repos/:owner/:repo/pulls/:pull_number", getPRDetail);

// PR 커밋 로그 조회
router.get("/repos/:owner/:repo/pulls/:pull_number/commits", getPRCommits);

export default router;
