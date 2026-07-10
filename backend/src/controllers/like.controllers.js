import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/Api_Response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toggleLike } from "../utils/Toogle_Like.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  return await toggleLike({ entityId: videoId, entityKey: "video", userId }, res);
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  return await toggleLike({ entityId: commentId, entityKey: "comment", userId }, res);
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const LikedVideoAggegate = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
            },
          },
          {
            $unwind: "$ownerDetails",
          },
        ],
      },
    },
    {
      $unwind: "$likedVideo",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: 0,
        likedVideo: {
          _id: 1,
          "videoFile.url": 1,
          "thumbnail.url": 1,
          owner: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
          isPublished: 1,
          "ownerDetails.avatar": 1,
          "ownerDetails.username": 1,
          "ownerDetails.fullName": 1,
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        LikedVideoAggegate,
        "liked videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };
