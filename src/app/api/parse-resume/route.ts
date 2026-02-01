import { NextRequest, NextResponse } from "next/server";

// Simple PDF text extraction without external AI
// Uses pdf-parse library for basic text extraction
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

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dynamically import pdf-parse
        let pdfParse;
        try {
            pdfParse = (await import("pdf-parse")).default;
        } catch {
            // If pdf-parse is not available, return the raw text extraction message
            return NextResponse.json({
                text: "PDF parsing library not available. Please copy your resume content manually.",
                full_name: "",
                email: "",
                phone: "",
                location: "",
                summary: "",
                links: [],
                skills: [],
                experiences: [],
                education: [],
                projects: [],
                certifications: [],
            });
        }

        // Parse PDF to extract text
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text || "";

        // Basic extraction patterns
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
        const githubMatch = text.match(/github\.com\/[\w-]+/i);

        // Try to get the first line as name (common resume pattern)
        const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
        const potentialName = lines[0]?.trim() || "";

        // Build basic extracted data
        const extractedData = {
            text: text.substring(0, 2000), // First 2000 chars for preview
            full_name: potentialName.length < 50 ? potentialName : "",
            email: emailMatch ? emailMatch[0] : "",
            phone: phoneMatch ? phoneMatch[0] : "",
            location: "",
            summary: "",
            links: [
                linkedinMatch ? { label: "LinkedIn", url: `https://${linkedinMatch[0]}` } : null,
                githubMatch ? { label: "GitHub", url: `https://${githubMatch[0]}` } : null,
            ].filter(Boolean),
            skills: [],
            experiences: [],
            education: [],
            projects: [],
            certifications: [],
        };

        return NextResponse.json(extractedData);
    } catch (error) {
        console.error("Resume parsing error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to parse resume" },
            { status: 500 }
        );
    }
}
