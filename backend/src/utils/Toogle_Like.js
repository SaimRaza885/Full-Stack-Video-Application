// utils/toggleLike.js

import { Like } from "../models/like.model.js";
import { isValidObjectId } from "mongoose";
import { ApiError } from "./Api_Error.js";
import { ApiResponse } from "./Api_Response.js";


export const toggleLike = async ({ entityId, entityKey, userId }, res) => {
    if (!isValidObjectId(entityId)) {
        throw new ApiError(400, `Invalid ${entityKey} ID`);
    }

    const isLiked = await Like.findOne({
        [entityKey]: entityId,
        likedBy: userId,
    });

    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }));
    }

    await Like.create({
        [entityKey]: entityId,
        likedBy: userId,
    });

    return res.status(200).json(new ApiResponse(200, { isLiked: true }));
};
