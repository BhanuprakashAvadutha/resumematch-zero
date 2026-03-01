'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Sparkles, Loader2, Target, XCircle } from 'lucide-react';

interface AnalysisResult {
    match_score: number;
    key_missing_skills: string[];
    formatting_issues: string[];
    improvement_tips: string[];
    summary_critique: string;
}

export default function PremiumScanner() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    const handleAnalyze = async () => {
        if (!file || !jobDescription.trim()) {
            setError("Please provide both a resume file and a job description.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDescription);

        try {
            const apiRes = await fetch("/api/premium-analyze", {
                method: "POST",
                body: formData,
            });

            if (!apiRes.ok) {
                const errorData = await apiRes.json();
                throw new Error(errorData.error || "Analysis failed due to a server error.");
            }

            const data: AnalysisResult = await apiRes.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score < 50) return { stroke: '#ef4444', text: 'text-red-500' }; // Red
        if (score < 75) return { stroke: '#eab308', text: 'text-yellow-500' }; // Yellow
        return { stroke: '#22c55e', text: 'text-green-500' }; // Green
    };

    const RadialGauge = ({ score }: { score: number }) => {
        const radius = 60;
        const strokeWidth = 10;
        const normalizedRadius = radius - strokeWidth * 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        const color = getScoreColor(score);

        return (
            <div className="relative flex items-center justify-center w-48 h-48 mx-auto group">
                {/* Background glowing effect */}
                <div className="absolute inset-0 rounded-full blur-xl opacity-20 transition-all duration-1000" style={{ backgroundColor: color.stroke }}></div>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90 relative z-10"
                >
                    {/* Background Circle */}
                    <circle
                        stroke="rgba(255,255,255,0.05)"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Circle with animation */}
                    <circle
                        stroke={color.stroke}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset: isAnalyzing ? circumference : strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center z-20">
                    <span className={`text-4xl font-bold tracking-tighter ${color.text} tabular-nums`}>
                        {score}%
                    </span>
                    <span className="text-xs uppercase font-semibold text-gray-500 tracking-widest mt-1">Match</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-2">
                        <Sparkles className="w-4 h-4" />
                        Enterprise Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Deep ATS Insight
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Powered by Google Gemini 2.0 Flash. Instantly analyze your resume against your target role with our strict intelligence engine.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div className="bg-[#111118] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                1. Upload Resume
                            </h2>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
                                    ${isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'}
                                    ${file ? 'bg-indigo-500/5 border-indigo-500/30' : ''}`}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud className={`w-10 h-10 mb-4 ${file ? 'text-indigo-400' : 'text-gray-500'}`} />
                                {file ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-white">{file.name}</p>
                                        <p className="text-xs text-gray-500">Click or drag to replace</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-300">Drag & drop your PDF or DOCX</p>
                                        <p className="text-xs text-gray-500">or click to browse</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="space-y-6">
                        <div className="bg-[#111118] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden hover:border-indigo-500/30 transition-colors flex flex-col h-full">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-400" />
                                2. Job Description
                            </h2>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="w-full h-full min-h-[160px] bg-[#0a0a0f] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Submit Action */}
                <div className="flex justify-center">
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !file || !jobDescription.trim()}
                        className={`relative group overflow-hidden rounded-full font-semibold transition-all duration-300 px-10 py-4 w-full md:w-auto
                            ${(isAnalyzing || !file || !jobDescription.trim())
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]'
                            }
                        `}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Engine Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Analyze Match</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>

                {/* Results Dashboard */}
                {result && !isAnalyzing && (
                    <div className="mt-16 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out space-y-8">

                        {/* Status Grid */}
                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Score Card */}
                            <div className="bg-[#111118] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl col-span-1">
                                <RadialGauge score={result.match_score} />
                                <div className="mt-6 text-center text-sm font-medium text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                                    <span className={getScoreColor(result.match_score).text}>{
                                        result.match_score >= 75 ? 'Excellent alignment' : result.match_score >= 50 ? 'Requires adjustments' : 'Significant gaps detected'
                                    }</span>
                                </div>
                            </div>

                            {/* Why It Matters */}
                            <div className="bg-[#111118] border border-gray-800 rounded-3xl p-8 shadow-xl col-span-1 md:col-span-2 flex flex-col justify-center">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-indigo-400" />
                                    Diagnosis
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {result.summary_critique}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Missing Keywords */}
                            <div className="bg-[#111118] border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-xl">
                                <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-4 flex justify-between items-center">
                                    Missing Critical Skills
                                    <span className="text-xs font-semibold bg-gray-800 text-gray-400 px-2 py-1 rounded-md">{result.key_missing_skills.length} Items</span>
                                </h3>
                                {result.key_missing_skills.length > 0 ? (
                                    <ul className="flex flex-wrap gap-2">
                                        {result.key_missing_skills.map((skill, idx) => (
                                            <li key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" /> All critical skills covered.
                                    </p>
                                )}
                            </div>

                            {/* Actionable Tips */}
                            <div className="bg-[#111118] border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-xl">
                                <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-4">Action Plan</h3>
                                <ul className="space-y-4">
                                    {result.improvement_tips.map((tip, idx) => (
                                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold border border-indigo-500/20">
                                                {idx + 1}
                                            </div>
                                            <span className="leading-relaxed">{tip}</span>
                                        </li>
                                    ))}
                                    {result.formatting_issues.map((issue, idx) => (
                                        <li key={`format-${idx}`} className="text-gray-300 text-sm flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold border border-yellow-500/20">
                                                !
                                            </div>
                                            <span className="leading-relaxed text-yellow-500/90">{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
