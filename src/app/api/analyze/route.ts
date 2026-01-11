import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import pdf from "pdf-parse";

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 2. Parse the Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "Missing file or description" }, { status: 400 });
    }

    // 3. Convert PDF to Buffer safely
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 4. Extract Text
    const data = await pdf(buffer);
    const resumeText = data.text;

    // 5. Connect to AI (FIX: Updated to 2026 Model 'gemini-2.5-flash')
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) optimizer.
      
      JOB DESCRIPTION:
      ${jobDescription.slice(0, 5000)}

      RESUME TEXT:
      ${resumeText.slice(0, 5000)}

      TASK:
      1. Score the match (0-100).
      2. Find missing keywords.
      3. Find matched keywords.
      4. Rewrite 3 bullet points.
      5. Provide feedback.

      OUTPUT MUST BE PURE JSON (No Markdown, no backticks):
      {
        "score": number,
        "missing_keywords": ["string"],
        "matched_keywords": ["string"],
        "rewritten_bullets": [{"original": "string", "new": "string"}],
        "feedback": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 6. Clean the JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(text);

    // 7. Save to Database (With await fix)
    try {
        const supabase = await createClient(); 
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            await supabase.from('scans').insert({
                user_id: user.id,
                job_title: jobDescription.slice(0, 50) + "...",
                match_score: analysis.score,
                missing_keywords: analysis.missing_keywords,
                matched_keywords: analysis.matched_keywords,
                feedback: analysis.feedback
            });
        }
    } catch (dbError) {
        console.error("Database save failed (non-fatal):", dbError);
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "AI Processing Failed. Try again." }, { status: 500 });
  }
}
