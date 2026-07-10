import { Router } from "express";
import {
  AccessRefreshToken,
  changeCurrentPassword,
  getCurrentUser,
  GetUserChannelProfile,
  GetUserHistory,
  loginUser,
  logoutUser,
  registerUser,
  UpdateAccountDetails,
  UpdateAvatar,
  UpdateCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import VerifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(VerifyJWT, logoutUser);

router.route("/refresh-token").post(AccessRefreshToken);

router
  .route("/change-password")
  .post(VerifyJWT, changeCurrentPassword); /*It Should be Patch  */

router.route("/current-user").get(VerifyJWT, getCurrentUser);

router
  .route("/update-account")
  .post(VerifyJWT, UpdateAccountDetails); /* it should be post*/

router.route("/change-avatar").patch(VerifyJWT, upload.single("avatar"), UpdateAvatar);

router
  .route("/change-cover-image")
  .patch(VerifyJWT, upload.single("coverImage"), UpdateCoverImage);

router.route("/c/:username").get(GetUserChannelProfile);

router.route("/history").get(VerifyJWT, GetUserHistory);

export default router;
