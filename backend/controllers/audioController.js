import fs from "fs";
import Audio from "../models/Audio.js";
import cloudinary from "../config/cloudinary.js";
import ytDownloader from "../utils/ytDownloader.js";
import path from "path";

// YouTube URL validation regex
const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/|m\.youtube\.com\/(watch\?v=|shorts\/))[\w-]+/;
    return youtubeRegex.test(url);
};


export const uploadAudio = async (req, res) => {
    let filePath = null;

    try {
        const { url, title } = req.body;

        // Validation
        if (!url || !title) {
            return res.status(400).json({ message: "URL and Title are required" });
        }

        if (!isValidYouTubeUrl(url)) {
            return res.status(400).json({ message: "Please provide a valid YouTube URL" });
        }

        // Check if title already exists
        const existingAudio = await Audio.findOne({ title });
        if (existingAudio) {
            return res.status(400).json({ message: "Audio with this title already exists" });
        }

        console.log(` Starting download for: ${title}`);

        // Step 1: Download & convert YouTube → MP3
        filePath = await ytDownloader(url);
        console.log(" Download completed:", filePath);

        const absolutePath = path.resolve(filePath);

        // Step 2: Upload to Cloudinary
        const result = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "video",
            folder: "yt-audios",
            public_id: title.replace(/\s+/g, "_") + "_" + Date.now(),
        });

        console.log(" Cloudinary upload completed");

        // Step 3: Save metadata in MongoDB
        const audio = await Audio.create({
            title,
            url: result.secure_url,
            originalUrl: url,
            uploader: req.user?._id || null,
            createdAt: new Date(),
        });

        // Step 4: Send response
        res.json({
            message: "Audio uploaded successfully",
            audio: {
                _id: audio._id,
                title: audio.title,
                url: audio.url,
                originalUrl: audio.originalUrl,
                createdAt: audio.createdAt
            },
        });

    } catch (error) {
        console.error(" Upload failed:", error.message);
        res.status(500).json({
            message: "Upload failed",
            error: error.message
        });
    } finally {
        // Step 5: Always clean up temp file
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(" Temp file cleaned up");
            } catch (cleanupError) {
                console.error(" Failed to cleanup temp file:", cleanupError.message);
            }
        }
    }
};

export const getAudios = async (req, res) => {
    try {
        const audios = await Audio.find()
            .select('title url originalUrl createdAt uploader')
            .sort({ createdAt: -1 })
            .populate('uploader', 'username email'); // Populate user info if needed
        res.json(audios);
    } catch (error) {
        console.error(" Error fetching audios:", error.message);
        res.status(500).json({ message: "Error fetching audios", error: error.message });
    }
};

export const searchAudios = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const audios = await Audio.find({
            title: new RegExp(q, "i")
        })
            .select('title url originalUrl createdAt uploader')
            .sort({ createdAt: -1 });

        res.json(audios);
    } catch (error) {
        console.error(" Search failed:", error.message);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};
