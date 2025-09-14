// utils/ytDownloader.js
import pkg from "yt-dlp-wrap";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { default: YTDlpWrap } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize yt-dlp wrapper
const ytDlpWrap = new YTDlpWrap();

export default async function ytDownloader(url, timeout = 300000) { // 5 minute timeout
    return new Promise((resolve, reject) => {
        const downloadsDir = path.join(__dirname, "../downloads");
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        // Generate a unique file path
        const timestamp = Date.now();
        const output = path.join(downloadsDir, `audio_${timestamp}.%(ext)s`);
        const expectedOutput = path.join(downloadsDir, `audio_${timestamp}.mp3`);

        console.log(`🎵 Starting download: ${url}`);
        console.log(`📂 Expected output: ${expectedOutput}`);

        // Set timeout
        const timeoutId = setTimeout(() => {
            console.error("⏰ Download timeout after 5 minutes");
            reject(new Error("Download timeout - the video might be too long or unavailable"));
        }, timeout);

        const process = ytDlpWrap.exec([
            url,
            "-f", "bestaudio/best",   // best available audio
            "-x",                     // extract audio
            "--audio-format", "mp3",  // convert to mp3
            "--audio-quality", "0",   // best quality
            "--no-playlist",          // only download single video
            "--max-filesize", "50M",  // limit file size to 50MB
            "-o", output,
        ]);

        process.on("ytDlpEvent", (event) => {
            if (event?.percent) {
                console.log(`⏳ Progress: ${event.percent.toFixed(2)}%`);
            }
        });

        process.on("error", (err) => {
            clearTimeout(timeoutId);
            console.error("❌ yt-dlp error:", err.message);

            // Provide more specific error messages
            if (err.message.includes("Video unavailable")) {
                reject(new Error("Video is unavailable or private"));
            } else if (err.message.includes("network")) {
                reject(new Error("Network error - please check your connection"));
            } else {
                reject(new Error(`Download failed: ${err.message}`));
            }
        });

        process.on("close", (code) => {
            clearTimeout(timeoutId);
            console.log(`✅ yt-dlp finished with code ${code}`);

            if (code === 0) {
                // Check if the expected file exists
                if (fs.existsSync(expectedOutput)) {
                    // Verify file size
                    const stats = fs.statSync(expectedOutput);
                    if (stats.size > 0) {
                        console.log(`📁 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
                        resolve(expectedOutput);
                    } else {
                        reject(new Error("Downloaded file is empty"));
                    }
                } else {
                    // Sometimes the extension might be different, check for any file with the timestamp
                    const files = fs.readdirSync(downloadsDir).filter(file =>
                        file.startsWith(`audio_${timestamp}`)
                    );

                    if (files.length > 0) {
                        const actualFile = path.join(downloadsDir, files[0]);
                        console.log(`📁 Found file: ${actualFile}`);
                        resolve(actualFile);
                    } else {
                        reject(new Error("Download completed but no output file found"));
                    }
                }
            } else {
                reject(new Error(`yt-dlp exited with code ${code}`));
            }
        });
    });
}
