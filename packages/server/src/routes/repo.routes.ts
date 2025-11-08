import { Router } from "express";
import { getCommits } from "../controllers/repo.controller";

const router = Router();

router.get("/commits", getCommits);

export default router;
