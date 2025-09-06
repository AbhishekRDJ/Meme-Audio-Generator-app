// utils/ytDownloader.js
import { Innertube } from "youtubei.js";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

export default async function ytDownloader(url) {
    try {
        const youtube = await Innertube.create();

        const info = await youtube.getInfo(url);

        // Get audio stream (webm)
        const stream = await youtube.download(url, {
            type: "audio",
            quality: "best"
        });

        const tempWebm = path.join("downloads", `${Date.now()}.webm`);
        const outputMp3 = path.join("downloads", `${Date.now()}.mp3`);

        // Save .webm first
        const webmFile = fs.createWriteStream(tempWebm);
        stream.pipe(webmFile);

        return new Promise((resolve, reject) => {
            webmFile.on("finish", () => {
                // Convert to MP3
                ffmpeg(tempWebm)
                    .toFormat("mp3")
                    .save(outputMp3)
                    .on("end", () => {
                        fs.unlinkSync(tempWebm); // cleanup webm
                        resolve(outputMp3);
                    })
                    .on("error", (err) => reject(err));
            });
            webmFile.on("error", reject);
        });
    } catch (error) {
        console.error("ytDownloader error:", error);
        throw error;
    }
}
