import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controllers.js"
import VerifyJWT from "../middleware/auth.middleware.js"
import optionalAuth from "../middleware/optionalAuth.middleware.js"

const router = Router();

router.route("/user/:userId").get(getUserPlaylists);

router.route("/").post(VerifyJWT, createPlaylist)

router
    .route("/:playlistId")
    .get(optionalAuth, getPlaylistById)
    .patch(VerifyJWT, updatePlaylist)
    .delete(VerifyJWT, deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(VerifyJWT, addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(VerifyJWT, removeVideoFromPlaylist);

export default router