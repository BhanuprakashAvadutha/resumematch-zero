"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Zap, Sparkles } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";

export default function ScannerSection() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobDescription) return;
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDescription);

        try {
            const res = await fetch("/api/analyze", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                    Resume Command Center
                </h1>
                <p className="text-gray-400">Public Access - No Login Required</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* LEFT: Inputs */}
                <div className="space-y-6">
                    <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors group">
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-200">{file ? file.name : "Upload Resume (PDF)"}</h3>
                                <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
                            </div>
                        </label>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 focus-within:border-blue-500/50 transition-colors">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-3">
                            <FileText size={16} /> Target Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full h-48 bg-transparent text-gray-200 resize-none focus:outline-none text-sm leading-relaxed"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !file || !jobDescription}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Analyzing..." : <><Zap size={20} /> Start Analysis</>}
                    </button>

                    {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error}</div>}
                </div>

                {/* RIGHT: Results */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl min-h-[500px] p-6 relative">
                    {result ? (
                        <AnalysisReport result={result} />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-4">
                            <Sparkles size={48} className="opacity-20" />
                            <p>Results will appear here...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
