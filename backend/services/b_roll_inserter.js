import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// Deduplicate B-roll insertions by keeping only the highest confidence placement
function dedupeByMaxConfidence(plan) {
  const bestByBroll = new Map();

  //  Find best placement per B-roll
  for (const item of plan.timeline) {
    if (item.type === "a_roll") continue;

    const existing = bestByBroll.get(item.type);
    if (!existing || item.confidence > existing.confidence) {
      bestByBroll.set(item.type, item);
    }
  }

  //  Rebuild timeline
  const filteredTimeline = plan.timeline.filter(item => {
    if (item.type === "a_roll") return true;
    return bestByBroll.get(item.type) === item;
  });

  //  Sort chronologically
  filteredTimeline.sort((a, b) => a.start - b.start);

  //  Rebuild insertions from timeline
  const insertions = filteredTimeline
    .filter(item => item.type !== "a_roll")
    .map(item => ({
      b_roll: item.type,
      insert_at: item.start,
      duration: +(item.end - item.start).toFixed(2),
      confidence: item.confidence,
    }));

  return {
    timeline: filteredTimeline,
    insertions,
  };
}


export async function generateVideoPlan(aRollSegments, bRollContexts) {
  const context = `
You are a video editing planner.

INPUT:
- A-roll segments with timestamps and semantic context
- B-roll clips with visual context

TYPE RULES:
- If the segment is A-roll:
  - type MUST be exactly "a_roll"
- If the segment is B-roll:
  - type MUST be the B-roll filename (exact match, e.g. "b_roll2.mp4")

B-ROLL USAGE RULES:
- You MAY insert the same B-roll multiple times.
- Insert a B-roll ONLY if confidence is >= 0.7.
- Higher confidence means better semantic match.
- The backend will deduplicate and keep the best placement.

TIMELINE RULES:
- The timeline MUST be a single unified list.
- The timeline MUST be globally sorted by start time.
- A-roll and B-roll entries MUST be interleaved by time.
- Do NOT invent timestamps.
- B-roll duration MUST NOT exceed the matched A-roll duration.

CONFIDENCE RULES:
- 0.9–1.0 → strong keyword overlap
- 0.7–0.8 → partial semantic match
- Below 0.7 → do NOT insert B-roll

OUTPUT:
- Return ONLY valid JSON
- No markdown
- No explanations

JSON SCHEMA:
{
  "timeline": [
    {
      "type": string,
      "start": number,
      "end": number,
      "context": string[],
      "confidence": number
    }
  ],
  "insertions": [
    {
      "b_roll": string,
      "insert_at": number,
      "duration": number,
      "confidence": number
    }
  ]
}

DATA:
A_ROLL = ${JSON.stringify(aRollSegments, null, 2)}
B_ROLL = ${JSON.stringify(bRollContexts, null, 2)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    messages: [
      { role: "system", content: "You generate strict JSON only." },
      { role: "user", content: context },
    ],
  });

  
  const raw = completion.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();

  const plan = JSON.parse(raw);

  
  return dedupeByMaxConfidence(plan);
}