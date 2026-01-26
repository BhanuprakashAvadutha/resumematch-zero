"use client";
import { useState } from "react";
import { Check, X, Copy, CheckCircle2, Lightbulb, Download, BarChart3, BrainCircuit, Mic } from "lucide-react";

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

    // --- LOGIC: Inferred Mini-Stats (Mock Logic for Visuals) ---
    // In a real app, this would be computed by the backend classifier.
    // Here we just infer based on basic keyword matching for demonstration.
    const hardSkillsCount = result.matched_keywords?.filter((k: string) =>
        ['sql', 'python', 'react', 'aws', 'analysis', 'data', 'code', 'design'].some(t => k.includes(t))
    ).length || Math.floor(result.matched_keywords?.length * 0.7) || 0;

    const softSkillsCount = (result.matched_keywords?.length || 0) - hardSkillsCount;

    // Top 3 Missing Keywords for Guide
    const topMissing = result.missing_keywords?.slice(0, 3).join(", ") || "essential keywords";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" id="analysis-report">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                    <p className="text-sm text-gray-400">Logic-Based Analysis v2.0</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors no-print"
                >
                    <Download size={16} /> Export PDF
                </button>
            </div>

            {/* Score Ring & Mini Stats */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                <div className="text-center relative">
                    <div className={`text-7xl font-black ${getScoreColor(result.score)}`}>
                        {result.score}%
                    </div>
                    <p className="text-gray-400 mt-2 font-medium">ATS Match Score</p>
                </div>

                {/* Mini Stats Cards */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                        <BrainCircuit size={20} className="text-blue-400 mb-1" />
                        <span className="text-xl font-bold text-white">{hardSkillsCount}</span>
                        <span className="text-xs text-gray-400">Hard Skills</span>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                        <Mic size={20} className="text-purple-400 mb-1" />
                        <span className="text-xl font-bold text-white">{softSkillsCount}</span>
                        <span className="text-xs text-gray-400">Soft Skills</span>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700 col-span-2 flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={20} className="text-emerald-400" />
                            <span className="text-xs text-gray-400">Total Keywords</span>
                        </div>
                        <span className="text-xl font-bold text-white">{result.matched_keywords?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Matched Column */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Check size={14} className="text-emerald-400" /> Matched ({result.matched_keywords?.length || 0})
                        </h3>
                        <button
                            onClick={() => copyToClipboard(result.matched_keywords, 'matched')}
                            className="text-gray-500 hover:text-white transition-colors no-print"
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
                            className="text-gray-500 hover:text-white transition-colors no-print"
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
            <div className="space-y-6 break-inside-avoid">
                <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl">
                    <h3 className="text-blue-400 font-bold mb-2">📊 Analysis Summary</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{result.feedback}</p>
                </div>

                <div className="bg-gray-900 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] p-6 rounded-xl">
                    <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                        <Lightbulb size={20} /> 📈 Optimization Guide
                    </h3>
                    <ul className="space-y-4 text-gray-300 text-sm">
                        <li className="flex gap-3">
                            <span className="text-purple-500 font-bold">1.</span>
                            <span>
                                <strong>Inject specific keywords.</strong> Add these missing keywords to your
                                <span className="bg-purple-500/20 text-purple-300 px-1 mx-1 rounded text-xs border border-purple-500/30">SKILLS</span>
                                section: <span className="text-white font-medium italic">{topMissing}</span>.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-500 font-bold">2.</span>
                            <span><strong>Quantify impact.</strong> Use numbers (e.g., "Improved X by 20%") to prove your Hard Skills.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-500 font-bold">3.</span>
                            <span><strong>Clickable Info.</strong> Ensure your email and LinkedIn are active hyperlinks.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
