import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    incrementViews,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js"
import VerifyJWT from "../middleware/auth.middleware.js"
import optionalAuth from "../middleware/optionalAuth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router();

router
    .route("/")
    .get(optionalAuth, getAllVideos)
    .post(
        VerifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(optionalAuth, getVideoById)
    .delete(VerifyJWT, deleteVideo)
    .patch(VerifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(VerifyJWT, togglePublishStatus);

router.route("/views/:videoId").patch(incrementViews);

export default router