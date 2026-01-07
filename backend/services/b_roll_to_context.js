import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function convert_to_context(filePath) {
  try {
    const myfile = await ai.files.upload({
      file: filePath,
      config: { mimeType: "video/mp4" },
    });

    let file = await ai.files.get({ name: myfile.name });
    while (file.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await ai.files.get({ name: myfile.name });
    }

    if (file.state === "FAILED") {
      throw new Error("Video processing failed");
    }

    const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-exp",
  contents: createUserContent([
    createPartFromUri(myfile.uri, myfile.mimeType),
    `
You are generating metadata for silent B-roll video matching.

RULES:
- Be concise
- No explanations
- No paragraphs
- No adjectives unless necessary

Return ONLY valid JSON in this exact format:

{
  "summary": "<max 12 words>",
  "keywords": ["...", "..."],
  "actions": ["..."],
  "scene": "..."
}

If unsure, infer visually.
`
  ]),
});

    
    return response.text;
  } catch (error) {
    console.error("Error converting b-roll to context:", error);
    throw error;
  }
}