"use client";
import { useResume } from "../ResumeContext";
import { validateSummaryLength } from "@/utils/wordCount";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SummarySection() {
    const { resume, updateResume } = useResume();
    const validation = validateSummaryLength(resume.summary);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">2</span>
                    Professional Summary
                </h2>

                <div className="flex items-center gap-2 text-sm">
                    {validation.isValid ? (
                        <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {validation.wordCount} words
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-yellow-400">
                            <AlertCircle className="w-4 h-4" />
                            {validation.wordCount} words
                        </span>
                    )}
                </div>
            </div>

            <textarea
                value={resume.summary}
                onChange={(e) => updateResume({ summary: e.target.value })}
                placeholder="A brief 2-3 sentence summary highlighting your key qualifications, experience, and career goals..."
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />

            {!validation.isValid && validation.message && (
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {validation.message}
                </p>
            )}

            <p className="text-xs text-gray-500">
                Tip: Keep your summary concise (20-50 words). Focus on your unique value proposition and key achievements.
            </p>
        </div>
    );
}
