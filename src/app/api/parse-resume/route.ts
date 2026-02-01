import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString("base64");

        // Use Gemini to parse the resume
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a resume parser. Analyze this PDF resume and extract the following information in JSON format.

Return ONLY valid JSON (no markdown, no code blocks, just pure JSON) with this exact structure:
{
    "full_name": "string - the person's full name",
    "email": "string - email address",
    "phone": "string - phone number",
    "location": "string - city, state or full address",
    "summary": "string - professional summary or objective if present",
    "links": [
        {"label": "LinkedIn", "url": "https://..."},
        {"label": "GitHub", "url": "https://..."},
        {"label": "Portfolio", "url": "https://..."}
    ],
    "skills": [
        {
            "id": "unique-id-1",
            "category": "Technical Skills",
            "items": ["Python", "JavaScript", "React"],
            "sort_order": 0
        }
    ],
    "experiences": [
        {
            "id": "unique-id-1",
            "title": "Job Title",
            "company": "Company Name",
            "location": "City, State",
            "start_date": "2024-01",
            "end_date": "Present",
            "bullets": ["Achievement 1", "Achievement 2"],
            "sort_order": 0
        }
    ],
    "education": [
        {
            "id": "unique-id-1",
            "degree": "Bachelor of Science in Computer Science",
            "institution": "University Name",
            "location": "City, State",
            "start_date": "2018-08",
            "end_date": "2022-05",
            "date_range": "Aug 2018 - May 2022",
            "gpa": "3.8",
            "notes": "Honors, relevant coursework",
            "sort_order": 0
        }
    ],
    "projects": [
        {
            "id": "unique-id-1",
            "name": "Project Name",
            "date_range": "2023-06",
            "bullets": ["Description 1", "Description 2"],
            "sort_order": 0
        }
    ],
    "certifications": [
        {
            "id": "unique-id-1",
            "name": "Certification Name",
            "issuer": "Issuing Organization",
            "date": "2023-06",
            "sort_order": 0
        }
    ]
}

Important rules:
1. Use empty strings "" for missing fields, not null
2. Use empty arrays [] for missing array fields
3. Generate unique IDs for each item (use format like "exp-1", "edu-1", etc.)
4. Format dates as "YYYY-MM" for start_date/end_date
5. Use "Present" for current positions in end_date
6. Extract ALL work experiences, education, projects you can find
7. Group skills by category (e.g., "Programming Languages", "Frameworks", "Tools")
8. If you can't find certain information, leave it as empty string/array

Parse this resume now:`;

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: base64Data,
                },
            },
            prompt,
        ]);

        const response = await result.response;
        let text = response.text();

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const parsedResume = JSON.parse(text);
            return NextResponse.json(parsedResume);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            return NextResponse.json(
                { error: "Failed to parse resume data. Please try again." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Resume parsing error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to parse resume" },
            { status: 500 }
        );
    }
}
