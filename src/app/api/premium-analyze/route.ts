import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string;

        if (!file || !jobDescription) {
            return NextResponse.json({ error: "Missing file or description" }, { status: 400 });
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

        // 2. Gemini Integration (Using 2.0 Flash)
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCe1qJuZPxIX348aVFKC3mKDH_limR4dyI";
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
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
            model: "gemini-2.5-flash", // Try 2.5 flash first
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
            console.warn("gemini-2.5-flash failed, falling back to gemini-3.1-flash-lite-preview due to error: ", generationError.message);
            model = genAI.getGenerativeModel({
                model: "gemini-3.1-flash-lite-preview", // Fallback to 3.1-flash-lite which is low cost
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });
            result = await model.generateContent(prompt);
        }

        const responseText = result.response.text();

        const analysis = JSON.parse(responseText);

        return NextResponse.json(analysis);

    } catch (error: any) {
        return NextResponse.json({ error: "System Error: " + error.message }, { status: 500 });
    }
}
