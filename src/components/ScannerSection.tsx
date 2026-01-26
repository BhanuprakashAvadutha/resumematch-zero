"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Zap, Sparkles, File as FileIcon, X, Clipboard, Trash2 } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";

export default function ScannerSection() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Drag & Drop Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                setError("Please upload a PDF file.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(null);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobDescription(text);
        } catch (err) {
            console.error("Failed to read clipboard:", err);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobDescription) return;
        setIsLoading(true);
        setError(null);
        setProgress(0);
        setResult(null); // Clear previous results

        // Simulated Progress Bar (0-90% over 2.5s)
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 5; // Increment by 5%
            });
        }, 150); // Updates every 150ms

        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDescription);

        try {
            const res = await fetch("/api/analyze", { method: "POST", body: formData });
            const data = await res.json();

            clearInterval(interval);
            setProgress(100);

            if (!res.ok) throw new Error(data.error || "Analysis failed");

            // Short delay to show 100% completion before showing result
            setTimeout(() => {
                setResult(data);
                setIsLoading(false);
            }, 500);

        } catch (err: any) {
            clearInterval(interval);
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                    Resume Command Center
                </h1>
                <p className="text-gray-400">Enterprise Grade Analysis • GPT-4 Powered</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* LEFT: Inputs */}
                <div className="space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`bg-gray-900 border-2 border-dashed rounded-2xl p-8 text-center transition-all group relative overflow-hidden ${isDragging ? "border-blue-500 bg-blue-500/5 scale-[1.02]" : "border-gray-700 hover:border-blue-500"
                            }`}
                    >
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />

                        {!file ? (
                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4 relative z-10">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-200">Upload Resume (PDF)</h3>
                                    <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
                                </div>
                            </label>
                        ) : (
                            <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-blue-500/30">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
                                    <FileIcon size={24} />
                                </div>
                                <div className="text-left overflow-hidden flex-1">
                                    <h3 className="text-sm font-bold text-gray-200 truncate">{file.name}</h3>
                                    <p className="text-xs text-blue-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                                    title="Remove file"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Job Description Area */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 focus-within:border-blue-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                <FileText size={16} /> Target Job Description
                            </label>
                            <button
                                onClick={handlePaste}
                                className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Clipboard size={14} /> Paste
                            </button>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here..."
                            className="w-full h-48 bg-transparent text-gray-200 resize-none focus:outline-none text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !file || !jobDescription}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="ml-3 text-sm font-medium text-blue-400">{progress}%</span>
                            </div>
                        ) : (
                            <><Zap size={20} /> Start Analysis</>
                        )}
                    </button>

                    {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
                </div>

                {/* RIGHT: Results */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl min-h-[500px] p-6 relative">
                    {result ? (
                        <AnalysisReport result={result} />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-4">
                            <Sparkles size={48} className="opacity-20 animate-pulse" />
                            <p>Ready to analyze...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
