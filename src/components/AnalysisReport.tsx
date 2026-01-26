"use client";
import { useState } from "react";
import { Check, X, Copy, CheckCircle2, Lightbulb } from "lucide-react";

export default function AnalysisReport({ result }: { result: any }) {
    const [copiedMissing, setCopiedMissing] = useState(false);
    const [copiedMatched, setCopiedMatched] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 50) return "text-amber-400";
        return "text-red-400";
    };

    const copyToClipboard = (keywords: string[], type: 'missing' | 'matched') => {
        if (!keywords || keywords.length === 0) return;
        navigator.clipboard.writeText(keywords.join(", "));
        if (type === 'missing') {
            setCopiedMissing(true);
            setTimeout(() => setCopiedMissing(false), 2000);
        } else {
            setCopiedMatched(true);
            setTimeout(() => setCopiedMatched(false), 2000);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" id="analysis-report">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                    <p className="text-sm text-gray-400">Logic-Based Analysis</p>
                </div>
                {/* Download button removed as per request */}
            </div>

            {/* Score */}
            <div className="text-center mb-10">
                <div className={`text-7xl font-black ${getScoreColor(result.score)}`}>
                    {result.score}%
                </div>
                <p className="text-gray-400 mt-2">ATS Match Score</p>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Matched Column */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Check size={14} className="text-emerald-400" /> Matched ({result.matched_keywords?.length || 0})
                        </h3>
                        <button
                            onClick={() => copyToClipboard(result.matched_keywords, 'matched')}
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Copy list"
                        >
                            {copiedMatched ? <span className="text-xs text-emerald-400">Copied!</span> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.matched_keywords?.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-medium">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Missing Column */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <X size={14} className="text-red-400" /> Missing ({result.missing_keywords?.length || 0})
                        </h3>
                        <button
                            onClick={() => copyToClipboard(result.missing_keywords, 'missing')}
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Copy list"
                        >
                            {copiedMissing ? <span className="text-xs text-emerald-400">Copied!</span> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.missing_keywords?.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-medium">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary & Pro Tips */}
            <div className="space-y-6">
                <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl">
                    <h3 className="text-blue-400 font-bold mb-2">📊 Analysis Summary</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{result.feedback}</p>
                </div>

                {/* Conditional: Old AI bullets OR New Pro Tips */}
                {result.rewritten_bullets && result.rewritten_bullets.length > 0 ? (
                    <div>
                        <h3 className="text-gray-200 font-bold mb-4">Suggested Rewrites</h3>
                        <div className="space-y-4">
                            {result.rewritten_bullets.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                                    <p className="text-xs text-red-400 mb-2 line-through opacity-70">{item.original}</p>
                                    <div className="flex gap-3 items-start">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                                        <p className="text-gray-200 text-sm">{item.new}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-900 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] p-6 rounded-xl">
                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                            <Lightbulb size={20} /> 📈 Optimization Guide
                        </h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex gap-3">
                                <span className="text-purple-500 font-bold">1.</span>
                                <span><strong>Quantify your impact.</strong> Use numbers (e.g., "Increased sales by 20%") instead of generic phrases.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-500 font-bold">2.</span>
                                <span><strong>Inject the missing keywords.</strong> Take the red keywords above and add them to your Skills or Experience section.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-500 font-bold">3.</span>
                                <span><strong>Clickable Contact Info.</strong> Ensure your email and LinkedIn URL are clickable hyperlinks.</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
