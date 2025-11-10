import { Router } from "express";
import { getGeneratedAbout } from "../controllers/aboutController.js";

const router = Router();

router.get("/generate", getGeneratedAbout);

export default router;
