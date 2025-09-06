// utils/ytDownloader.js
import pkg from "yt-dlp-wrap";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { default: YTDlpWrap } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BIN_PATH = path.join(__dirname, "../bin/yt-dlp");

// if binary not exists, download once from GitHub
if (!fs.existsSync(BIN_PATH)) {
    console.log("⬇️ Downloading yt-dlp binary...");
    await YTDlpWrap.downloadFromGithub(BIN_PATH);
}

const ytDlpWrap = new YTDlpWrap(BIN_PATH);

export default async function ytDownloader(url) {
    return new Promise((resolve, reject) => {
        const downloadsDir = path.join(__dirname, "../downloads");
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        const output = path.join(downloadsDir, `${Date.now()}.mp3`);
        console.log(`🎵 Starting download: ${url}`);
        console.log(`📂 Output: ${output}`);

        const process = ytDlpWrap.exec([
            url,
            "-f", "bestaudio/best",
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "0",
            "-o", output,
        ]);

        process.on("error", reject);

        process.on("close", (code) => {
            if (code === 0 && fs.existsSync(output)) {
                resolve(output);
            } else {
                reject(new Error("yt-dlp failed to produce output"));
            }
        });
    });
}
