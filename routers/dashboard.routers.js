import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get('/channel/:channelId/stats', getChannelStats);
router.get('/channel/:channelId/videos', getChannelVideos);

export default router;
