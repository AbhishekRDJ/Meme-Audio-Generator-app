import fs from "fs";
import Audio from "../models/Audio.js";
import cloudinary from "../config/cloudinary.js";
import ytDownloader from "../utils/ytDownloader.js";
import path from "path";


export const uploadAudio = async (req, res) => {
    try {
        const { url, title } = req.body;
        if (!url || !title) {
            return res.status(400).json({ message: "URL and Title are required" });
        }

        // Step 1: Download & convert YouTube → MP3
        const filePath = await ytDownloader(url);
        console.log("Uploading file:", filePath);
        const absolutePath = path.resolve(filePath);
        console.log("Uploading absolute path:", absolutePath);


        // Step 2: Upload to Cloudinary
        const result = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "video",
            folder: "yt-audios",
            public_id: title.replace(/\s+/g, "_") + "_" + Date.now(),
        }).catch(err => {
            console.error("Cloudinary Upload Error:", err);
            throw err;
        });

        console.log("File exists?", fs.existsSync(filePath));
        // Step 3: Delete temp file after upload
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // Step 4: Save metadata in MongoDB
        const audio = await Audio.create({
            title,
            url: result.secure_url,
            uploader: req.user?._id || null, // ✅ safe if user is optional
            createdAt: new Date(),
        });

        // Step 5: Send response
        res.json({
            message: "Audio uploaded successfully",
            audio,
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};

export const getAudios = async (req, res) => {
    try {
        const audios = await Audio.find().sort({ createdAt: -1 }); // newest first
        res.json(audios);
    } catch (error) {
        res.status(500).json({ message: "Error fetching audios", error: error.message });
    }
};


export const searchAudios = async (req, res) => {
    try {
        const { q } = req.query;
        const audios = await Audio.find({ title: new RegExp(q, "i") });
        res.json(audios);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
};
