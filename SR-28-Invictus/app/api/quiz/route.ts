import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const CACHE_DIR = path.join(process.cwd(), 'cache', 'quizzes');

export async function POST(req: Request) {
    try {
        const { planet } = await req.json();

        if (!planet) {
            return NextResponse.json({ error: "Planet name is required" }, { status: 400 });
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const planetName = planet.toLowerCase();
        const cachePath = path.join(CACHE_DIR, `${planetName}_${today}.json`);

        // 1️⃣ Check if cache exists
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }

        if (fs.existsSync(cachePath)) {
            console.log(`Using cached quiz for ${planetName}`);
            const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
            return NextResponse.json(cachedData);
        }

        // 2️⃣ Initialize Gemini client
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Define schema for structured output
        const schema = {
            description: "A list of quiz questions about a planet",
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: { type: SchemaType.NUMBER },
                    question: { type: SchemaType.STRING },
                    options: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING }
                    },
                    correctAnswer: { type: SchemaType.STRING },
                    explanation: { type: SchemaType.STRING }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
            }
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema as any,
            }
        });

        // 3️⃣ Prompt
        const prompt = `Generate 6 challenging and interesting multiple-choice questions about the planet ${planet} for today's daily mission (${today}). 
    Each question should have 4 options and a clear explanation. 
    Focus on scientific facts, history, and unique features. Ensure variety from previous standard questions.`;

        // 4️⃣ Generate content
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const questions = JSON.parse(responseText);

        const resultData = { planet: planetName, date: today, questions };

        // 5️⃣ Save to cache
        fs.writeFileSync(cachePath, JSON.stringify(resultData, null, 2));

        console.log(`Generated new quiz for ${planetName}`);
        return NextResponse.json(resultData);

    } catch (error: any) {
        console.error("Quiz Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate quiz" },
            { status: 500 }
        );
    }
}
