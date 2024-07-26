import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const [totalVideos, totalViews, totalSubscribers, totalLikes] = await Promise.all([
        Video.countDocuments({ owner: channelId }),
        Video.aggregate([
            { $match: { owner: mongoose.Types.ObjectId(channelId) } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]).then(results => results[0]?.totalViews || 0),
        Subscription.countDocuments({ channel: channelId }),
        Like.countDocuments({ video: { $in: await Video.find({ owner: channelId }).select("_id") } })
    ]);

    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    };

    res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ owner: channelId });

    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

//exporting channel 
export {
    getChannelStats,
    getChannelVideos
};
