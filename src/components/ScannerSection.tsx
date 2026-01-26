"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, FileText, CheckCircle2, AlertCircle, Zap, Sparkles, File as FileIcon, X, Clipboard, Trash2, LogOut, Save, FolderOpen, ChevronDown } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";

export default function ScannerSection() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const supabase = createClient();

    // Fetch User for Internal Header
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
        };
        getUser();
    }, [supabase]);

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

    // Reset Handler for AnalysisReport
    const handleReset = () => {
        setResult(null);
        setFile(null);
        setJobDescription("");
        setProgress(0);
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
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                    Resume Command Center
                </h1>
                <p className="text-gray-400">Enterprise Grade Analysis v2.0</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Command Center Header */}
                <div className="bg-gray-950/50 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Online</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400 hidden sm:inline-block">{userEmail || "Loading..."}</span>
                        <form action={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/login";
                        }}>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* LEFT: Inputs */}
                    <div className="p-8 space-y-8 border-r border-gray-800/50">
                        {/* 1. Upload Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">1</span>
                                Upload Resume
                            </h2>

                            {!file ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`bg-gray-950 border-2 border-dashed rounded-xl p-8 text-center transition-all group relative overflow-hidden ${isDragging ? "border-blue-500 bg-blue-500/5 scale-[1.02]" : "border-gray-800 hover:border-blue-500 hover:bg-gray-900"
                                        }`}
                                >
                                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4 relative z-10 w-full">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            <Upload size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-200 group-hover:text-white">Click to Upload or Drag PDF</h3>
                                            <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-green-500/30 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div className="text-left overflow-hidden flex-1">
                                        <h3 className="text-sm font-bold text-gray-200 truncate">{file.name}</h3>
                                        <p className="text-xs text-green-400">Ready for analysis • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                                        title="Change file"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Job Description Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">2</span>
                                    Target Job
                                </h2>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                                        <FolderOpen size={14} /> Load Saved <ChevronDown size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 focus-within:border-blue-500/50 transition-colors relative group">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Description</label>
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
                                    className="w-full h-40 bg-transparent text-gray-200 resize-none focus:outline-none text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                                />
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg shadow-lg" title="Save for Later">
                                        <Save size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !file || !jobDescription}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                                    <div className="w-full max-w-xs h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-blue-400 tabular-nums">{progress}%</span>
                                </div>
                            ) : (
                                <><Zap size={20} className="group-hover:text-yellow-300 transition-colors" /> Start Analysis Engine</>
                            )}
                        </button>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Results */}
                    <div className="bg-gray-950/30 p-8 min-h-[600px] flex flex-col relative">
                        {result ? (
                            <AnalysisReport result={result} onReset={handleReset} />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Sparkles size={40} className="text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-200">Awaiting Input</h3>
                                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Upload your resume and the target job description to begin the deep scan.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
