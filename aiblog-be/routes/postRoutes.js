import { Router } from "express";
import { generatePost } from "../controllers/postController.js";

const router = Router();

router.post("/generate", generatePost);

export default router;
