import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/Api_Response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video Not Found");
  }

  const CommentAgregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "OwnerDetails",
      },
    },

    {
      $addFields: {

        owner: { $first: "$OwnerDetails" },
      }
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        content: 1,
        owner: {
          _id: 1,
          username: 1,
          fullName: 1,
          avatar: 1,
        },
      },
    },
  ]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const comments = await Comment.aggregatePaginate(CommentAgregate, options);
  // console.log(comments);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments Fetched SuccessFully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "content is requried");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VideoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video Not Found");
  }

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: video._id,
  });

  if (!comment) {
    throw new ApiError(500, "Faild to add comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Added SuccessFully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content) {
    throw new ApiError(400, "content is requried");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id ");
  }

  const isCommentAvaliable = await Comment.findById(commentId);

  if (!isCommentAvaliable) {
    throw new ApiError(404, "Comment not found");
  }
  const UpdatedComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { content } },
    { new: true }
  );

  if (!UpdatedComment) {
    throw new ApiError(500, "Faild to Updated the comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, UpdatedComment, "comment Updated SuccessFullys")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment Not Found");
  }

  if (comment?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "only comment owner can delete their comment");
  }

  const deletedComment = await Comment.findOneAndDelete({ _id: commentId });

  if (!deletedComment) {
    throw new ApiError(500, "Faild to delete the comment");
  }

  await Like.deleteMany({
    comment: commentId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, commentId, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
