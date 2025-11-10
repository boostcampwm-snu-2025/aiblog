import { Router } from "express";
import {
  listRepos,
  listCommits,
  getCommitDetails,
} from "../controllers/githubController.ts";

const router = Router();

router.get("/repos", listRepos);
router.get("/repos/:repoOrg/:repoName/commits", listCommits);
router.get(
  "/repos/:repoOrg/:repoName/commits/:commitHash",
  getCommitDetails
);

export default router;
