import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { createClient } from "@/utils/supabase/server";
import * as AnalysisEngine from "@/utils/analysis-engine";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string;

        if (!file || !jobDescription) {
            return NextResponse.json({ error: "Missing file or description" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
        }

        // 1. Parsing PDF
        let resumeText = "";
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const data = await pdf(buffer);
            resumeText = data.text;
        } catch (e) {
            return NextResponse.json({ error: "PDF Parsing Failed." }, { status: 400 });
        }

        // 2. Logic-Based Analysis (New Engine)
        const jobKeywords = AnalysisEngine.extractKeywords(jobDescription);
        const resumeKeywords = AnalysisEngine.extractKeywords(resumeText);

        // Calculate Score & Matches
        const result = AnalysisEngine.calculateScore(jobKeywords, resumeKeywords);

        // 3. Generate Static Feedback
        let feedback = "";
        if (result.score > 80) feedback = "Excellent match! Your resume contains most required skills.";
        else if (result.score > 50) feedback = "Good start, but you are missing key technical terms.";
        else feedback = "Low match. You need to add the missing keywords listed above.";

        const analysis = {
            score: result.score,
            missing_keywords: result.missing.slice(0, 20),
            matched_keywords: result.matched.slice(0, 20),
            rewritten_bullets: [], // No AI
            feedback
        };

        // 4. Save to Database
        try {
            await supabase.from('scans').insert({
                user_id: user.id,
                resume_filename: file.name,
                resume_size_bytes: file.size,
                resume_text: resumeText,
                job_description: jobDescription,
                job_description_snippet: jobDescription.slice(0, 100),
                match_score: result.score,
                missing_keywords: analysis.missing_keywords,
                matched_keywords: analysis.matched_keywords,
                feedback: feedback
            });
        } catch (dbError) {
            console.error("DB Save Failed (Ignored):", dbError);
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        return NextResponse.json({ error: "System Error: " + error.message }, { status: 500 });
    }
}
