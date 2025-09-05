// utils/ytDownloader.js
import pkg from "yt-dlp-wrap";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { default: YTDlpWrap } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// make sure yt-dlp binary exists
const ytDlpWrap = new YTDlpWrap();

export default async function ytDownloader(url) {
    return new Promise((resolve, reject) => {
        const downloadsDir = path.join(__dirname, "../downloads");
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        // generate a unique file path
        const output = path.join(downloadsDir, `${Date.now()}.mp3`);

        console.log(`🎵 Starting download: ${url}`);
        console.log(`📂 Output: ${output}`);

        const process = ytDlpWrap.exec([
            url,
            "-f", "bestaudio/best",   // best available audio
            "-x",                     // extract audio
            "--audio-format", "mp3",  // convert to mp3
            "--audio-quality", "0",   // best quality
            "-o", output,
        ]);

        process.on("ytDlpEvent", (event) => {
            if (event?.percent) {
                console.log(`⏳ Progress: ${event.percent.toFixed(2)}%`);
            }
        });

        process.on("error", (err) => {
            console.error("❌ yt-dlp error:", err);
            reject(err);
        });

        process.on("close", (code) => {
            console.log(`✅ yt-dlp finished with code ${code}`);
            if (fs.existsSync(output)) {
                resolve(output);
            } else {
                reject(new Error("yt-dlp did not create output file"));
            }
        });
    });
}
