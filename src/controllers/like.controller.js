import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const userId = req.user._id;
    const existingLike = await Like.findOne({ video: videoId, likeBy: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
    } else {
        await Like.create({ video: videoId, likeBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Video liked"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const userId = req.user._id;
    const existingLike = await Like.findOne({ comment: commentId, likeBy: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
    } else {
        await Like.create({ comment: commentId, likeBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Comment liked"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const userId = req.user._id;
    const existingLike = await Like.findOne({ tweet: tweetId, likeBy: userId });

    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
    } else {
        await Like.create({ tweet: tweetId, likeBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Tweet liked"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likedVideos = await Like.find({ likeBy: userId, video: { $exists: true } })
        .populate('video')
        .exec();

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
