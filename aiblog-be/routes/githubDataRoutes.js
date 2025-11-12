import { Router } from "express";
import {
	getRecentCommits,
	getMyRepos,
	getMyPullRequests,
} from "../controllers/githubDataController.js";

const router = Router();

router.get("/my-repos", getMyRepos);
router.get("/recent-commits", getRecentCommits);
router.get("/my-pull-requests", getMyPullRequests);

export default router;
