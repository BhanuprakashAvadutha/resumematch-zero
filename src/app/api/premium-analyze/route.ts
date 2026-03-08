import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string;

        if (!file || !jobDescription) {
            return NextResponse.json({ error: "Missing file or description" }, { status: 400 });
        }

        // AUTH CHECK — Security requirement
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to use the scanner." }, { status: 401 });
        }

        // SCAN LIMIT — 2 scans per user per day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count: todayScans } = await supabase
            .from("scans")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", today.toISOString());

        if (todayScans !== null && todayScans >= 2) {
            return NextResponse.json({
                error: "Daily scan limit reached (2/2). Please try again tomorrow."
            }, { status: 429 });
        }

        // 1. Parsing PDF
        let resumeText = "";
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const data = await pdf(buffer);
            resumeText = data.text;
        } catch (e) {
            return NextResponse.json({ error: "PDF Parsing Failed. Ensure it is a valid format." }, { status: 400 });
        }

        // 2. AI Integration
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI engine is not configured. Please contact support." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Define exact schema constraints
        const responseSchema: Schema = {
            type: SchemaType.OBJECT,
            properties: {
                match_score: { type: SchemaType.NUMBER, description: "A score from 0 to 100 representing the resume's match to the JD." },
                key_missing_skills: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "High-priority keywords found in the JD but missing from the Resume."
                },
                formatting_issues: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Any formatting issues detected with the resume text."
                },
                improvement_tips: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Specific bullet points on how to improve the resume for this role."
                },
                summary_critique: {
                    type: SchemaType.STRING,
                    description: "A brief, actionable summary explaining why this score was given."
                },
                rewritten_bullet_points: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "3 to 5 highly optimized, ATS-friendly rewritten bullet points tailored to the job description that the user should add to their resume."
                },
            },
            required: ["match_score", "key_missing_skills", "formatting_issues", "improvement_tips", "summary_critique", "rewritten_bullet_points"],
        };

        let model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const prompt = `You are an expert Enterprise ATS system. Analyze the following resume against the job description and extract insights according to the JSON schema constraint perfectly. Never output markdown formatting.
        
Resume Text:
${resumeText}

Job Description:
${jobDescription}`;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (generationError: any) {
            console.warn("Primary model failed, falling back:", generationError.message);
            model = genAI.getGenerativeModel({
                model: "gemini-3-flash-preview",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });
            result = await model.generateContent(prompt);
        }

        const responseText = result.response.text();
        const analysis = JSON.parse(responseText);

        // Save to Database
        try {
            await supabase.from('scans').insert({
                user_id: user.id,
                resume_filename: file.name,
                resume_size_bytes: file.size,
                resume_text: resumeText,
                job_description: jobDescription,
                job_description_snippet: jobDescription.slice(0, 100),
                match_score: analysis.match_score,
                score: analysis.match_score,
                missing_keywords: analysis.key_missing_skills,
                matched_keywords: [],
                feedback: analysis.summary_critique
            });
        } catch (dbError) {
            console.error("DB Save Failed (Ignored):", dbError);
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        return NextResponse.json({ error: "Analysis failed. Please try again in a few moments." }, { status: 500 });
    }
}
