import express from "express";
import { uploadAudio, getAudios, searchAudios } from "../controllers/audioController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadAudio);
router.get("/all", getAudios);
router.get("/search", searchAudios);

export default router;
