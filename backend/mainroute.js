import express from "express"
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import { spawn } from "child_process"
import { convert_to_context } from "./services/b_roll_to_context.js";
import { generateVideoPlan } from "./services/b_roll_inserter.js";


ffmpeg.setFfmpegPath(ffmpegPath)
const corsOptions = {
  origin: 'http://localhost:5173',
};
const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors(corsOptions));


//Upload endpoint
app.post(
  "/upload",
  upload.fields([
    { name: "a_roll", maxCount: 1 },
    { name: "b_rolls", maxCount: 10 },
  ]),
  (req, res) => {
    const a_roll = req.files["a_roll"]?.[0];
    if (!a_roll) return res.status(400).json({ error: "No a_roll uploaded" });

    // parallel b-roll processing
    const b_rolls = req.files["b_rolls"] || [];
    const bRollContextsPromise = Promise.all(
      b_rolls.map(async (file) => {
        try {
          console.log(`Processing B-roll: ${file.originalname}`);
          const context = await convert_to_context(file.path);
          return { filename: file.originalname, path: file.path, context };
        } catch (e) {
          console.error(`Error processing B-roll ${file.originalname}:`, e);
          return { filename: file.originalname, path: file.path, error: e.message };
        }
      })
    );

    const inputPath = a_roll.path;
    const outputPath = `${inputPath}.mp3`;

    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .save(outputPath)
      .on("end", () => {
        
        const python = spawn("python", ["./python/transcribe.py", outputPath]);

        let data = "";

        python.stdout.on("data", (chunk) => {
          data += chunk.toString();
        });

        let stderr = "";

        python.stderr.on("data", (chunk) => {
          stderr += chunk.toString();
        });

        python.on("close", async (code) => {
          if (code !== 0) {
            console.error("Python failed:", stderr);
            return res.status(500).json({ error: stderr });
          }

          try {
            const segments = JSON.parse(data);
            const bRolls = await bRollContextsPromise;
            const result = await generateVideoPlan(segments, bRolls);
            return res.json({ result });
          } catch (e) {
            console.error("Invalid JSON or B-roll error:", e);
            return res.status(500).json({ error: "Processing failed" });
          }
        });

      })
      .on("error", (err) => {
        res.status(500).json({ error: err.message });
      });
  }
);



app.listen(3000, () => {
  console.log("Server started on port 3000");
})