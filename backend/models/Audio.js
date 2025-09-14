import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    url: { type: String, required: true }, // Cloudinary MP3 URL
    originalUrl: { type: String, required: true }, // Original YouTube URL
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Audio = mongoose.model("Audio", audioSchema);
export default Audio;