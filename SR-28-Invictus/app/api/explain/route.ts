import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const CACHE_PATH = path.join(process.cwd(), 'cache', 'apodExplanation.json');

export async function POST(req: Request) {
  try {
    const { title, description, date } = await req.json(); // get APOD date

    // 1️⃣ Check if cache exists
    if (fs.existsSync(CACHE_PATH)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      if (cached.date === date && cached.explanation) {
        console.log("Using cached explanation");
        return NextResponse.json({ explanation: cached.explanation });
      }
    }

    // 2️⃣ Initialize Gemini client
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3️⃣ Prompt
    const promptText = `
You are an astronomy expert explaining NASA's Astronomy Picture of the Day.
Rules:
1. Provide 3-4 concise bullet points.
2. Use clear, informative language suitable for a general audience.
3. Separate each point with a '|' character only.
4. Do not add extra text or titles.

Information:
Title: ${title}
Original Description: ${description}
`;

    // 4️⃣ Generate content
    const result = await model.generateContent([{ text: promptText }]);
    let explanation = result.response.text?.()?.trim() || "";
    explanation = explanation.replace(/[*#`]/g, "");

    // 5️⃣ Save to cache
    fs.writeFileSync(CACHE_PATH, JSON.stringify({ date, explanation }, null, 2));

    console.log("Generated new explanation:", explanation);

    return NextResponse.json({ explanation });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
