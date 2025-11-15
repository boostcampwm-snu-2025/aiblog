import { Router } from "express";
import { getCommits, getPullRequests } from "../controllers/repo.controller";

const router = Router();

router.get("/commits", getCommits);
router.get("/pulls", getPullRequests);

export default router;
