import { Router } from "express";
import githubRouter from "./github.ts";
import aiRouter from "./ai.ts";
import postsRouter from "./posts.ts";

const router = Router();

router.use("/github", githubRouter);
router.use("/ai", aiRouter);
router.use("/posts", postsRouter);

export default router;
