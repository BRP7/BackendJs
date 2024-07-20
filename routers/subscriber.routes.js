import express from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";

const router = express.Router();

router.post('/channel/:channelId/subscribe', toggleSubscription);
router.get('/channel/:channelId/subscribers', getUserChannelSubscribers);
router.get('/user/:subscriberId/subscriptions', getSubscribedChannels);

export default router;
