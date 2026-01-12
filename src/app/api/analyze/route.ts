// DEBUG VERSION 1.0 - FORCE DEPLOY
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: Request) {
  try {
    // 1. Check API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing.");
      return NextResponse.json({ error: "Server Error: GEMINI_API_KEY is missing in Vercel." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "Missing file or description" }, { status: 400 });
    }

    // 2. Convert PDF
    let resumeText = "";
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdf(buffer);
      resumeText = data.text;
    } catch (e) {
      return NextResponse.json({ error: "PDF Parsing Failed. File might be corrupted." }, { status: 400 });
    }

    // 3. Connect to AI (Using 1.5-flash)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are an expert ATS optimizer.
        JOB DESCRIPTION: ${jobDescription.slice(0, 5000)}
        RESUME TEXT: ${resumeText.slice(0, 5000)}
        TASK: Output pure JSON with score (0-100), missing_keywords, matched_keywords, rewritten_bullets, feedback.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      const analysis = JSON.parse(text);
      
      return NextResponse.json(analysis);
    } catch (error: any) {
      return NextResponse.json({ error: "Google AI Error: " + error.message }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: "System Error: " + error.message }, { status: 500 });
  }
}
