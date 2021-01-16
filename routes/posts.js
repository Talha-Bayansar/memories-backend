import express from "express";
import {
  getPosts,
  createPost,
  deletePost,
  editPost,
  like,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", editPost);
router.put("/like/:id", like);

export default router;
