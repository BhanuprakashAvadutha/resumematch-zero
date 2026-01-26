import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { createClient } from "@/utils/supabase/server";

// 1. Define Stop Words (Common words to ignore)
const STOP_WORDS = new Set([
    "the", "and", "a", "an", "to", "of", "in", "for", "with", "on", "at",
    "experience", "work", "job", "responsibilities", "skills", "team",
    "company", "position", "role", "candidate", "requirements", "qualifications",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "but", "if", "or", "because", "as", "until", "while",
    "about", "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "from", "up", "down", "out", "off", "over", "under", "again"
]);

// Helper to clean text and extract unique keywords
const cleanAndExtractKeywords = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter(word => word.length > 2) // Ignore tiny words
        .filter(word => !STOP_WORDS.has(word)); // Remove stop words
};

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

        // 2. Parse PDF
        let resumeText = "";
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const data = await pdf(buffer);
            resumeText = data.text;
        } catch (e) {
            return NextResponse.json({ error: "PDF Parsing Failed." }, { status: 400 });
        }

        // 3. The Math Engine (Keyword Matching)
        const jobKeywords = new Set(cleanAndExtractKeywords(jobDescription));
        const resumeKeywords = new Set(cleanAndExtractKeywords(resumeText));

        const matched_keywords: string[] = [];
        const missing_keywords: string[] = [];

        jobKeywords.forEach(keyword => {
            if (resumeKeywords.has(keyword)) {
                matched_keywords.push(keyword);
            } else {
                missing_keywords.push(keyword);
            }
        });

        // 4. Scoring Logic
        let score = 0;
        if (jobKeywords.size > 0) {
            score = Math.round((matched_keywords.length / jobKeywords.size) * 100);
        }
        if (score > 100) score = 100;

        // 5. Generate Static Feedback
        let feedback = "";
        if (score > 80) feedback = "Excellent match! Your resume contains most required skills.";
        else if (score > 50) feedback = "Good start, but you are missing key technical terms.";
        else feedback = "Low match. You need to add the missing keywords listed above.";

        const analysis = {
            score,
            missing_keywords: missing_keywords.slice(0, 20), // Top 20 missing
            matched_keywords: matched_keywords.slice(0, 20),
            rewritten_bullets: [], // No AI = No Rewrites
            feedback
        };

        // 6. Save to Database (Non-blocking)
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase.from('scans').insert({
                    user_id: user.id,
                    job_description_snippet: jobDescription.slice(0, 100),
                    match_score: score,
                    missing_keywords: analysis.missing_keywords,
                    matched_keywords: analysis.matched_keywords,
                    feedback: feedback
                });
            }
        } catch (dbError) {
            console.error("DB Save Failed (Ignored):", dbError);
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        return NextResponse.json({ error: "System Error: " + error.message }, { status: 500 });
    }
}
