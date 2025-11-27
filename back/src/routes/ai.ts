import { Router } from "express";
import { generatePost } from "@/controllers/aiController.ts";

const router = Router();

router.post("/generate", generatePost);

export default router;
