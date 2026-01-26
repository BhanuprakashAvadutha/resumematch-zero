import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { createClient } from "@/utils/supabase/server";

// 1. Nuclear Blacklist (Strict Filtering)
const STOP_WORDS = new Set([
    // 1. User-Specified "Garbage" (Verbs/Adjectives)
    "collect", "clean", "analyze", "analyzing", "large", "multiple", "sources", "prepare", "preparing", "reports", "visualizations", "closely", "understand", "understanding", "deliver", "delivering", "solutions", "build", "building", "improve", "improving", "existing", "develop", "developing", "developer", "maintain", "maintaining", "documentation", "kpis", "kpi",

    // 2. Common Corporate Verbs (Actions - NOT Skills)
    "manage", "managing", "management", "support", "supporting", "coordinate", "coordinating", "collaborate", "collaborating", "communicate", "communicating", "provide", "providing", "perform", "performing", "conduct", "conducting", "review", "reviewing", "assess", "assessing", "evaluate", "evaluating", "ensure", "ensuring", "assist", "assisting", "create", "creating", "design", "designing", "implement", "implementing", "lead", "leading", "drive", "driving", "track", "tracking", "monitor", "monitoring", "identify", "identifying", "resolve", "resolving", "solve", "solving", "participate", "participating", "contribute", "contributing", "demonstrate", "demonstrating", "focus", "focusing", "utilize", "utilizing", "use", "using", "require", "requiring", "include", "including",

    // 3. Adjectives / Fluff
    "responsible", "accountable", "proven", "successful", "excellent", "strong", "good", "great", "outstanding", "exceptional", "proficient", "fluent", "experienced", "qualified", "capable", "able", "various", "several", "many", "much", "more", "less", "least", "most", "best", "better", "worst", "simple", "complex", "effective", "efficient", "timely", "daily", "weekly", "monthly", "yearly", "annual", "global", "local", "internal", "external", "strategic", "tactical", "senior", "junior",

    // 4. Standard Grammar
    "the", "and", "a", "an", "to", "of", "in", "for", "with", "on", "at", "from", "by", "about", "as", "into", "like", "through", "after", "over", "between", "out", "against", "during", "without", "before", "under", "around", "among", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "should", "would", "will", "may", "might", "must"
]);

// 2. Skill Whitelist (Protected acronyms)
const PROTECTED_SKILLS = new Set(["sql", "css", "aws", "gcp", "azure", "seo", "sem", "crm", "cms", "erp", "sap", "sas", "r", "c", "ci", "cd", "ui", "ux", "qa", "ml", "ai", "llm", "api"]);

// Helper to clean text and extract unique keywords
const cleanAndExtractKeywords = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Normalize logic
        .split(/\s+/) // Split by whitespace
        .filter(word => {
            if (PROTECTED_SKILLS.has(word)) return true; // Whitelist logic
            if (word.length <= 2) return false;          // Length logic
            return !STOP_WORDS.has(word);                // Blacklist logic
        });
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
        // Boost low scores slightly to reduce discouragement
        if (score > 0 && score < 15) score = 15;

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
                    resume_filename: file.name,
                    resume_size_bytes: file.size,
                    resume_text: resumeText,
                    job_description: jobDescription,
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
