import express from "express";
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../src/controllers/like.controller.js";
import { authMiddleware } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

router.post('/video/:videoId', authMiddleware, toggleVideoLike);
router.post('/comment/:commentId', authMiddleware, toggleCommentLike);
router.post('/tweet/:tweetId', authMiddleware, toggleTweetLike);
router.get('/videos', authMiddleware, getLikedVideos);

export default router;
