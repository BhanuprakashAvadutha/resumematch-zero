"use client";
import { useMemo } from "react";
import { useResume } from "./ResumeContext";
import { detectAvoidedWords, getReplacementSuggestions } from "@/utils/detectAvoidedWords";
import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function AvoidedWordsPanel() {
    const { resume } = useResume();
    const [isExpanded, setIsExpanded] = useState(true);

    const avoidedWords = useMemo(() => detectAvoidedWords({
        summary: resume.summary,
        experiences: resume.experiences,
        projects: resume.projects
    }), [resume.summary, resume.experiences, resume.projects]);

    if (avoidedWords.length === 0) {
        return null;
    }

    // Group by word
    const groupedWords = avoidedWords.reduce((acc, match) => {
        if (!acc[match.word]) {
            acc[match.word] = [];
        }
        acc[match.word].push(match);
        return acc;
    }, {} as Record<string, typeof avoidedWords>);

    const uniqueWords = Object.keys(groupedWords);

    return (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-medium text-red-300">
                            Weak Words Detected
                        </h3>
                        <p className="text-xs text-red-400/70">
                            {avoidedWords.length} instance{avoidedWords.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-red-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-red-400" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-gray-400">
                        These words can weaken your resume. Consider rephrasing:
                    </p>

                    {uniqueWords.slice(0, 5).map((word) => {
                        const matches = groupedWords[word];
                        const suggestions = getReplacementSuggestions(word);

                        return (
                            <div key={word} className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-red-300">
                                        &quot;{word}&quot;
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {matches.length}x in {matches[0].location}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400 italic line-clamp-2">
                                    &quot;...{matches[0].context}...&quot;
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    <span className="text-xs text-gray-500">Try:</span>
                                    {suggestions.slice(0, 3).map((suggestion, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded"
                                        >
                                            {suggestion}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {uniqueWords.length > 5 && (
                        <p className="text-xs text-gray-500 text-center">
                            +{uniqueWords.length - 5} more weak words found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
