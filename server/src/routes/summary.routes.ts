import type { Router } from "express";
import { Router as ExpressRouter } from "express";
import * as summaryController from "../controllers/summary.controller";
import { asyncHandler } from "../middleware/async-handler";
import { errorHandler } from "../middleware/error-handler";

const router: Router = ExpressRouter();

router.get("/summaries", asyncHandler(summaryController.listSummaries));

router.get(
	"/summaries/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.getSummary),
);

router.post(
	"/summaries/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.createSummary),
);

router.delete(
	"/summaries/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.deleteSummary),
);

router.use(errorHandler);

export default router;
