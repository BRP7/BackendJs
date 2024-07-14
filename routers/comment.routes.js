import express from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../src/controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/video/:videoId", getVideoComments);
router.post("/video/:videoId", authMiddleware, addComment);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
