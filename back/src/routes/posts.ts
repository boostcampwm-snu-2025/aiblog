import { Router } from "express";
import {
  listPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "@/controllers/postsController.ts";

const router = Router();

router.get("/", listPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
