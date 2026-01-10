'use client';

import { useState } from 'react';
import { AnalysisResponse } from '@/types';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobDescription', jobDescription);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-500 border-green-500/50 shadow-green-500/20';
        if (score >= 40) return 'text-yellow-500 border-yellow-500/50 shadow-yellow-500/20';
        return 'text-red-500 border-red-500/50 shadow-red-500/20';
    };

    return (
        <main className="container mx-auto px-6 py-12">
            {/* Hero */}
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                    Beat the Bots.
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Our ruthless AI analyzes your resume against job descriptions to expose weaknesses before the ATS does.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left: Input Form */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Target Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={8}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                                placeholder="Paste the full job description here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Your Resume (PDF)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-black/50 group-hover:border-white/20'}`}>
                                    {file ? (
                                        <div className="flex items-center justify-center gap-3 text-indigo-400">
                                            <FileText className="w-6 h-6" />
                                            <span className="font-medium">{file.name}</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-gray-500">
                                            <Upload className="w-8 h-8 mx-auto" />
                                            <p className="text-sm font-medium">Drop your PDF here or click to browse</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-500/20 p-4 rounded-xl text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Resume'
                            )}
                        </button>
                    </form>
                </div>

                {/* Right: Results */}
                <div className="space-y-6">
                    {result ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            {/* Score Card */}
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
                                <h3 className="text-gray-400 font-medium mb-4 uppercase tracking-widest text-sm">Match Score</h3>
                                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 text-5xl font-black shadow-lg ${getScoreColor(result.score)}`}>
                                    {result.score}
                                </div>
                                <p className="mt-6 text-gray-300 leading-relaxed text-lg">
                                    {result.feedback}
                                </p>
                            </div>

                            {/* Keywords */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <h3 className="flex items-center gap-2 font-bold text-red-400 mb-4">
                                        <XCircle className="w-5 h-5" />
                                        Missing Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missing_keywords.length > 0 ? (
                                            result.missing_keywords.map(kw => (
                                                <span key={kw} className="px-3 py-1 rounded-full bg-red-950/30 border border-red-500/20 text-red-300 text-sm">
                                                    {kw}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-sm italic">None required.</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <h3 className="flex items-center gap-2 font-bold text-green-400 mb-4">
                                        <CheckCircle className="w-5 h-5" />
                                        Matched Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matched_keywords.length > 0 ? (
                                            result.matched_keywords.map(kw => (
                                                <span key={kw} className="px-3 py-1 rounded-full bg-green-950/30 border border-green-500/20 text-green-300 text-sm">
                                                    {kw}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-sm italic">No matches found.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Improvements */}
                            {result.rewritten_bullets && result.rewritten_bullets.length > 0 && (
                                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <h3 className="font-bold text-white mb-6">Recommended Improvements</h3>
                                    <div className="space-y-4">
                                        {result.rewritten_bullets.map((item, idx) => (
                                            <div key={idx} className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3">
                                                <div className="text-red-400/80 text-sm line-through decoration-red-400/50 pl-2 border-l-2 border-red-500/30">
                                                    {item.original}
                                                </div>
                                                <div className="text-green-400 text-sm pl-2 border-l-2 border-green-500">
                                                    {item.new}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Placeholder / Empty State */
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-12 text-zinc-800">
                            <div className="text-center space-y-2">
                                <div className="text-6xl font-black opacity-20">ZERO</div>
                                <p>Analysis results will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
