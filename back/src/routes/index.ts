import { Router } from "express";
import githubRouter from "@/routes/github.ts";
import aiRouter from "@/routes/ai.ts";
import postsRouter from "@/routes/posts.ts";

const router = Router();

router.use("/github", githubRouter);
router.use("/ai", aiRouter);
router.use("/posts", postsRouter);

export default router;
