"use client";
import { useState, useMemo } from "react";
import { useResume } from "./ResumeContext";
import { matchResumeWithJD } from "@/utils/extractKeywords";
import { Target, Zap, Check, X, Clipboard } from "lucide-react";

export default function JDMatcherPanel() {
    const { resume } = useResume();
    const [jobDescription, setJobDescription] = useState("");
    const [showResults, setShowResults] = useState(false);

    const matchResult = useMemo(() => {
        if (!jobDescription.trim()) return null;
        return matchResumeWithJD({
            summary: resume.summary,
            skills: resume.skills,
            experiences: resume.experiences,
            projects: resume.projects
        }, jobDescription);
    }, [resume, jobDescription]);

    const handleMatch = () => {
        if (jobDescription.trim()) {
            setShowResults(true);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobDescription(text);
        } catch (err) {
            console.error("Failed to paste:", err);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-green-400";
        if (score >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    const getScoreBg = (score: number) => {
        if (score >= 75) return "from-green-500/20 to-green-500/5";
        if (score >= 50) return "from-yellow-500/20 to-yellow-500/5";
        return "from-red-500/20 to-red-500/5";
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-300">JD Matcher</h3>
                    <p className="text-xs text-gray-500">Match your resume to a job</p>
                </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Paste Job Description</label>
                    <button
                        onClick={handlePaste}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Clipboard className="w-3 h-3" />
                        Paste
                    </button>
                </div>
                <textarea
                    value={jobDescription}
                    onChange={(e) => {
                        setJobDescription(e.target.value);
                        setShowResults(false);
                    }}
                    placeholder="Paste the job description here to see how well your resume matches..."
                    rows={4}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                />
                <button
                    onClick={handleMatch}
                    disabled={!jobDescription.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    <Zap className="w-4 h-4" />
                    Match Resume
                </button>
            </div>

            {/* Results */}
            {showResults && matchResult && (
                <div className="space-y-4 pt-4 border-t border-gray-800">
                    {/* Score */}
                    <div className={`bg-gradient-to-r ${getScoreBg(matchResult.matchScore)} rounded-lg p-4`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Match Score</span>
                            <span className={`text-2xl font-bold ${getScoreColor(matchResult.matchScore)}`}>
                                {matchResult.matchScore}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${matchResult.matchScore >= 75 ? 'bg-green-500' :
                                        matchResult.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${matchResult.matchScore}%` }}
                            />
                        </div>
                    </div>

                    {/* Missing Keywords */}
                    {matchResult.missingKeywords.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-red-400 uppercase tracking-wide flex items-center gap-1">
                                <X className="w-3 h-3" />
                                Missing Keywords ({matchResult.missingKeywords.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {matchResult.missingKeywords.slice(0, 15).map((keyword, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                                {matchResult.missingKeywords.length > 15 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{matchResult.missingKeywords.length - 15} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Matched Keywords */}
                    {matchResult.matchedKeywords.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-green-400 uppercase tracking-wide flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Matched Keywords ({matchResult.matchedKeywords.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {matchResult.matchedKeywords.slice(0, 10).map((keyword, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                                {matchResult.matchedKeywords.length > 10 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{matchResult.matchedKeywords.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {matchResult.suggestions.length > 0 && (
                        <div className="space-y-1">
                            {matchResult.suggestions.map((suggestion, i) => (
                                <p key={i} className="text-xs text-gray-400">
                                    💡 {suggestion}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
