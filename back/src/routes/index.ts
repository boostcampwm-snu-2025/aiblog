import { Router } from "express";
import githubRouter from "./github.ts";
import aiRouter from "./ai.ts";

const router = Router();

router.use("/github", githubRouter);
router.use("/ai", aiRouter);

export default router;
