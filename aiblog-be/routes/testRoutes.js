import { Router } from "express";
import { getVersion } from "../controllers/testController.js";

const router = Router();

router.get("/version", getVersion);

export default router;
