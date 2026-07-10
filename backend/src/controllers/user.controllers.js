import jwt from "jsonwebtoken";
import fs from "fs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Api_Error.js";
import { ApiResponse } from "../utils/Api_Response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cloudinary_File_Upload, deleteOnCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";

const GenerateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.GenerateAccessToken();
    const refreshToken = user.GenerateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Faild to generate ACCESS and REFRESH token", error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const Existed_User = await User.findOne({ $or: [{ username }, { email }] });
  if (Existed_User) {
    throw new ApiError(409, "The email or username already exists");
  }

  const localAvatarPath = req.files?.avatar?.[0]?.path;
  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar profile image file is required");
  }

  const localCoverImagePath = req.files?.coverImage?.[0]?.path || req.files?.coverimage?.[0]?.path;

  const avatar = await Cloudinary_File_Upload(localAvatarPath);
  if (!avatar?.url) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }
  const avatarData = { url: avatar.url, public_id: avatar.public_id };

  let coverImageData = { url: '', public_id: '' };
  if (localCoverImagePath) {
    const coverImage = await Cloudinary_File_Upload(localCoverImagePath);
    if (!coverImage?.url) {
      throw new ApiError(400, "Failed to upload cover image to Cloudinary");
    }
    coverImageData = { url: coverImage.url, public_id: coverImage.public_id };
  }

  [localAvatarPath, localCoverImagePath].forEach((p) => {
    if (p && fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  });



  const user = await User.create({
    fullName,
    avatar: avatarData,
    coverImage: coverImageData,
    email,
    password,
    username: username.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(500, "Faild to create the user ")
  }

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(userCreated._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: userCreated,
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
});
const loginUser = asyncHandler(async (req, res) => {
  // Algorithm
  // get data form (req.body)
  // email or username
  // find user
  // password check
  // access and resfresh token
  // send cookie

  const { username, email, password } = req.body;
  // console.log("Request body:", req.body);

  if (!email && !username) {
    throw new ApiError(404, "Email or Username is requreid");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "Please first get REGISTER then try for logging");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "plese give a write password");
  }

  const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const opitons = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200) /* To check that diffrent status code create errir or not */
    .cookie("accessToken", accessToken, opitons)
    .cookie("refreshToken", refreshToken, opitons)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken /*it is a case whre user wnat to save token */,
        },
        "user LoggedIn SUCESSFULLY"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout SuccessFully"));
});

// An EndPoint to Generate new Access and REfresh token

const AccessRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Invalid Refresh Token Given By User");
  }

  try {
    const decodedInfo = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    if (!decodedInfo) {
      throw new ApiError(404, "Please give a correct | Valid Refresh Token");
    }

    const user = await User.findById(decodedInfo._id);

    if (!user) {
      throw new ApiError(404, "Cannot Find the User | Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(404, "The Given Refresh Token Did not match");
    }

    const { accessToken, refreshToken } =
      await GenerateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Successfully Refreshed the Token"
        )
      );
  } catch (error) {
    throw new ApiError(404, error.message || "Failed to Refresh Token");
  }
});

// Change Current Password

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Validate input fields
  if (!oldPassword) {
    throw new ApiError(400, "Old password is missing");
  }
  if (!newPassword) {
    throw new ApiError(400, "New password is missing");
  }

  // Find user
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect old password");
  }

  // Update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // Bypassing validation to skip other required fields

  // Return response without sensitive user data
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Curent User

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Get The Current User SuccessFully"));
});

// Update UserAccount Details
const UpdateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  // Check that at least one field is provided
  if (!email && !fullName) {
    throw new ApiError(
      400,
      "At least one field is required (email or fullName)"
    );
  }

  // Find the user
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "Cannot find the user");
  }

  // Update user fields (only if provided)
  const updateFields = {};
  if (email) updateFields.email = email;
  if (fullName) updateFields.fullName = fullName;

  const updatedAccountDetails = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAccountDetails,
        "Account details updated successfully"
      )
    );
});

// Productoin Guide that always write a seprate controller for updateing files

// Updating file (avatar)

const UpdateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file path is missing");
  }


  const oldPublicId = req.user?.avatar?.public_id;


  const avatarUploadResult = await Cloudinary_File_Upload(avatarLocalPath);
  if (!avatarUploadResult?.url) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }

  const AvatarData = {
    url: avatarUploadResult.url,
    public_id: avatarUploadResult.public_id
  };

  // 3. Update DB record 
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: AvatarData } },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update avatar in the database");
  }


  if (oldPublicId) {
    const wasDeleted = await deleteOnCloudinary(oldPublicId);
    if (!wasDeleted) {
      console.log(`⚠️ Warning: Previous asset (${oldPublicId}) failed to clear from Cloudinary servers.`);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Successfully updated avatar"));
});

// Updating file (CoverImage)
const UpdateCoverImage = asyncHandler(async (req, res) => {

  const localPath = req.file?.path;
  const oldPublicId = req.user?.coverImage?.public_id

  if (!localPath) {
    throw new ApiError(400, "Cover image file path is missing");
  }
  let CoverImageData = { url: '', public_id: '' }

  const uploadResult = await Cloudinary_File_Upload(localPath);

  if (!uploadResult?.url) {
    throw new ApiError(400, "Failed to upload cover image to Cloudinary");
  }

  CoverImageData = { url: uploadResult.url, public_id: uploadResult.public_id };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: CoverImageData,
      },
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update cover image in the database");
  }

  if (oldPublicId) {
    const wasDeleted = await deleteOnCloudinary(oldPublicId);
    if (!wasDeleted) {
      console.log(`⚠️ Warning: Previous asset (${oldPublicId}) failed to clear from Cloudinary servers.`);
    }

  }
  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser,
      "Successfully updated the cover image"
    )
  );
});


// Get Your channel profile

const GetUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username not Found");
  }


  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelSubscribeToCount: {
          $size: "$subscribedTo",
        },
        isSubscribe: req.user?._id ? {
          $cond: {
            if: { $in: [req.user._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        } : false,
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        coverImage: 1,
        fullName: 1,
        avatar: 1,
        subscriberCount: 1,
        channelSubscribeToCount: 1,
        isSubscribe: 1,
      },
    },
  ]);

  if (!channel?.length) {
    /* Check and make it > 0 */
    throw new ApiError(400, "Chanel does not exist");
  }
  console.log(channel[0])
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel Created SuccessFully")
    );
});

// Get yours WatchHistory
const GetUserHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "WatchHistory",
        foreignField: "_id",
        as: "WatchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  /* remove this out and then */
                  $project: {
                    username: 1,
                    coverImage: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);


  console.log(user[0].WatchHistory)
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].WatchHistory,
        "User WatchHistory Fetched SuccessFully "
      )
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  AccessRefreshToken,
  changeCurrentPassword,
  getCurrentUser,
  UpdateAccountDetails,
  UpdateAvatar,
  UpdateCoverImage,
  GetUserChannelProfile,
  GetUserHistory,
};
