import type { Router } from "express";
import { Router as ExpressRouter } from "express";
import * as summaryController from "../controllers/summary.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { errorHandler } from "../middleware/error-handler.js";

const router: Router = ExpressRouter();

router.get("/", asyncHandler(summaryController.listSummaries));

router.get(
	"/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.getSummary),
);

router.post(
	"/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.createSummary),
);

router.delete(
	"/:owner/:repo/commits/:ref",
	asyncHandler(summaryController.deleteSummary),
);

router.use(errorHandler);

export default router;
