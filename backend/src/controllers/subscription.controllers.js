import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/Api_Response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channel id");
  }

  const isSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed?._id);
    return res.status(200).json(new ApiResponse(200, { isSubscribed: false }));
  }

  await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });
  return res.status(200).json(new ApiResponse(200, { isSubscribed: true }));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // if (!channelId) {
  //   throw new ApiError(400, "invalid channel id");
  // }

  const ChannelId = new mongoose.Types.ObjectId(channelId);

  const channel_Subscribers_Aggerate = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(ChannelId),
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "subscriber",
        as: "subscriber",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribedToSubscriber",
            },
          },
          {
            $addFields: {
              subscribeToSubscriber: {
                $cond: {
                  if: {
                    $in: [ChannelId, "$subscribedToSubscriber.subscriber"],
                  },
                  then: true,
                  else: false,
                },
              },

              subscribersCount: {
                $size: "$subscribedToSubscriber",
              },
            },
          },

        ],
      },
    },
    {
      $unwind: "$subscriber",
    },
    {
      $project: {
        _id: 0,
        subscriber: {
          _id: 1,
          username: 1,
          fullName: 1,
          avatar: 1,
          subscribedToSubscriber: 1,
          subscribersCount: 1,
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channel_Subscribers_Aggerate,
        "subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // if (!subscriberId) {
  //   throw new ApiError(400, "Invalid Subscriber id");
  // }

  const Subscriber_Id = new mongoose.Types.ObjectId(subscriberId);

  const Subscribed_Channel = await Subscription.aggregate([
    {
      $match: {
        subscriber: Subscriber_Id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannels",
        pipeline: [
          {
            $lookup: {
              from: "videos",
              foreignField: "owner",
              localField: "_id",
              as: "UserVideos",
            },
          },
          {
            $addFields: {
              latestVideo: {
                $last: "$UserVideos",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$subscribedChannels",
    },
    {
      $project: {
        _id: 0,
        subscribedChannels: {
          username: 1,
          fullName: 1,
          avatar: 1,
          latestVideo: {
            "videoFile.url": 1,
            "thumbnail.url": 1,
            title: 1,
            description: 1,
            owner: 1,
            duration: 1,
            createdAt: 1,
            views: 1,
          },
        },
      },
    },
  ]);

  if (!Subscribed_Channel.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No subscribed channels found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        Subscribed_Channel,
        "subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
