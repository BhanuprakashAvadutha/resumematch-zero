"use client";
import { Check, X, Download, Copy } from "lucide-react";

export default function AnalysisReport({ result }: { result: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/50 shadow-emerald-500/20";
    if (score >= 50) return "text-amber-400 border-amber-500/50 shadow-amber-500/20";
    return "text-red-400 border-red-500/50 shadow-red-500/20";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" id="analysis-report">
      {/* Header with Download */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
          <p className="text-sm text-gray-400">AI-Generated Feedback</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors no-print"
        >
          <Download size={16} /> Save PDF
        </button>
      </div>

      {/* Score */}
      <div className="flex justify-center mb-10">
        <div className={`relative w-40 h-40 rounded-full border-4 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] ${getScoreColor(result.score)}`}>
          <div className="text-center">
            <span className="text-5xl font-bold block">{result.score}</span>
            <span className="text-xs uppercase tracking-widest opacity-80">Match</span>
          </div>
        </div>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3 text-red-400 font-bold uppercase text-xs tracking-wider">
            <X size={14} /> Missing Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords?.map((k: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 rounded text-sm">
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold uppercase text-xs tracking-wider">
            <Check size={14} /> Matched Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matched_keywords?.map((k: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded text-sm">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback & Bullets */}
      <div className="space-y-6">
        <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl">
            <h3 className="text-blue-400 font-bold mb-2">💡 AI Feedback</h3>
            <p className="text-gray-300 leading-relaxed text-sm">{result.feedback}</p>
        </div>

        <div>
            <h3 className="text-gray-200 font-bold mb-4">Suggested Bullet Point Rewrites</h3>
            <div className="space-y-4">
                {result.rewritten_bullets?.map((item: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl group hover:border-blue-500/30 transition-colors">
                        <p className="text-xs text-red-400 mb-2 line-through opacity-70">{item.original}</p>
                        <div className="flex gap-3 items-start">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                            <p className="text-gray-200 text-sm">{item.new}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
