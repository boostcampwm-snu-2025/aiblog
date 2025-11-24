import type { Router } from "express";
import { Router as ExpressRouter } from "express";
import * as githubController from "../controllers/github.controller.js";
import { asyncGithubHandler } from "../middleware/async-handler.js";
import { errorHandler } from "../middleware/error-handler.js";

const router: Router = ExpressRouter();

router.get(
	"/orgs/:org/repos",
	asyncGithubHandler(githubController.listOrgRepos),
);

router.get(
	"/repos/:owner/:repo",
	asyncGithubHandler(githubController.getRepository),
);

router.get(
	"/repos/:owner/:repo/branches",
	asyncGithubHandler(githubController.listBranches),
);

router.get(
	"/repos/:owner/:repo/branches/:branch/commits",
	asyncGithubHandler(githubController.listBranchCommits),
);

router.get(
	"/repos/:owner/:repo/commits/:ref",
	asyncGithubHandler(githubController.getCommit),
);

router.get(
	"/repos/:owner/:repo/pulls",
	asyncGithubHandler(githubController.listPullRequests),
);

router.get(
	"/repos/:owner/:repo/pulls/:pull_number/commits",
	asyncGithubHandler(githubController.listPullRequestCommits),
);

router.get(
	"/search/repositories",
	asyncGithubHandler(githubController.searchRepositories),
);

router.get(
	"/users/:username/repos",
	asyncGithubHandler(githubController.listUserRepos),
);

router.use(errorHandler);

export default router;
