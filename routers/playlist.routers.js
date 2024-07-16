import express from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // assuming you have an auth middleware to check user authentication

const router = express.Router();

router.post('/', authMiddleware, createPlaylist);
router.get('/', authMiddleware, getUserPlaylists);
router.get('/:playlistId', authMiddleware, getPlaylistById);
router.post('/:playlistId/videos/:videoId', authMiddleware, addVideoToPlaylist);
router.delete('/:playlistId/videos/:videoId', authMiddleware, removeVideoFromPlaylist);
router.delete('/:playlistId', authMiddleware, deletePlaylist);
router.put('/:playlistId', authMiddleware, updatePlaylist);

export default router;
