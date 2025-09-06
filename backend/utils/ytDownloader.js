// utils/ytDownloader.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import play from "play-dl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function ytDownloader(url) {
    const downloadsDir = path.join(__dirname, "../downloads");
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
    }

    const output = path.join(downloadsDir, `${Date.now()}.mp3`);

    console.log(`🎵 Starting download: ${url}`);
    console.log(`📂 Output: ${output}`);

    // Fetch YouTube audio
    const stream = await play.stream(url, { quality: 1 });
    const file = fs.createWriteStream(output);

    await new Promise((resolve, reject) => {
        stream.stream.pipe(file);
        stream.stream.on("end", resolve);
        stream.stream.on("error", reject);
    });

    console.log(`✅ File downloaded: ${output}`);
    return output;
}
