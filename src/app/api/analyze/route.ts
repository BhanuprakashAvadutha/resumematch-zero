import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini system prompt – strict "Ruthless ATS Bot"
const GEMINI_SYSTEM_PROMPT = `You are a ruthless ATS (Applicant Tracking System) bot. Analyze the provided resume text against the given job description and produce a strict JSON output matching the following structure:

{
  "score": number, // 0-100
  "missing_keywords": string[],
  "matched_keywords": string[],
  "rewritten_bullets":Array<{ "original": string, "new": string }>, // Suggest improvements for weak bullets
  "feedback": string // Brutally honest summary
}

Do not include any explanations, apologies, markdown formatting (like \`\`\`json), or extra fields. Only return the raw JSON object.`;

export async function POST(request: Request) {
    try {
        // 1️⃣ Parse FormData
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const jobDescription = (formData.get('jobDescription') as string) ?? '';

        if (!file) {
            return NextResponse.json({ error: 'PDF file missing' }, { status: 400 });
        }

        // 2️⃣ PDF → Text
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdfParse(buffer);
        const resumeText = pdfData.text;

        // 3️⃣ Gemini AI analysis
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: GEMINI_SYSTEM_PROMPT,
        });

        const prompt = `Resume Text:\n${resumeText}\n\nJob Description:\n${jobDescription}`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // Expecting strict JSON – parse safely
        let analysisResult: any;
        try {
            analysisResult = JSON.parse(responseText);
        } catch (e) {
            return NextResponse.json({ error: 'Gemini returned malformed JSON' }, { status: 502 });
        }

        // 4️⃣ Store in Supabase if user is logged in
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!userError && user) {
            try {
                await supabase.from('scans').insert({
                    user_id: user.id,
                    result: analysisResult,
                    created_at: new Date().toISOString(),
                });
            } catch (dbErr) {
                // Log but do not block response – optional console.log
                console.error('Failed to insert scan:', dbErr);
            }
        }

        // 5️⃣ Return analysis JSON
        return NextResponse.json(analysisResult);
    } catch (err) {
        console.error('Unexpected error in /api/analyze:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
