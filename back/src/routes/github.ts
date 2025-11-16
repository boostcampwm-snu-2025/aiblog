import { Router } from "express";
import {
  getRepoList,
  getCommitList,
  getCommitDetailList,
} from "../controllers/githubController.ts";

const router = Router();

router.get("/repos", getRepoList);
router.get("/repos/:repoOrg/:repoName/commits", getCommitList);
router.get(
  "/repos/:repoOrg/:repoName/commits/:commitHash",
  getCommitDetailList,
);

export default router;
