"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Zap, Shield, Sparkles } from "lucide-react";
import AnalysisReport from "@/components/AnalysisReport";

export default function Home() {
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
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION (Scanner) */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Beat the ATS Robots.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stop getting rejected. Our AI scans your resume against the job description 
            and tells you exactly what keywords you are missing.
          </p>
        </div>

        {/* The Scanner Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Inputs */}
          <div className="space-y-6">
            {/* Dropzone */}
            <div className="bg-[var(--bg-surface)] border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors group">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-200">
                    {file ? file.name : "Upload Resume (PDF)"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
                </div>
              </label>
            </div>

            {/* JD Input */}
            <div className="bg-[var(--bg-surface)] border border-gray-800 rounded-2xl p-4 focus-within:border-blue-500/50 transition-colors">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-3">
                <FileText size={16} /> Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-48 bg-transparent text-gray-200 resize-none focus:outline-none text-sm leading-relaxed"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !file || !jobDescription}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning ATS Filters...
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-current" /> Analyze Match
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                <AlertCircle size={20} /> {error}
              </div>
            )}
          </div>

          {/* RIGHT: Results Area */}
          <div className="bg-[var(--bg-surface)] border border-gray-800 rounded-2xl min-h-[500px] p-6 relative overflow-hidden">
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

      {/* 2. TRUST BAR */}
      <section className="border-t border-white/5 bg-white/2 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-6">
            Optimized for Modern ATS Algorithms
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Simple Text Logos for speed */}
            <span className="text-xl font-bold">Greenhouse</span>
            <span className="text-xl font-bold">Lever</span>
            <span className="text-xl font-bold">Workday</span>
            <span className="text-xl font-bold">Taleo</span>
            <span className="text-xl font-bold">iCIMS</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why use ResuMatch Zero?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant AI Score</h3>
            <p className="text-gray-400 leading-relaxed">
              We use Google's advanced Gemini 2.5 Flash model to compare your resume against the job description in seconds.
            </p>
          </div>
          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">100% Private</h3>
            <p className="text-gray-400 leading-relaxed">
              Your resume is processed securely. We do not sell your data to recruiters or third-party agencies.
            </p>
          </div>
          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Rewrites</h3>
            <p className="text-gray-400 leading-relaxed">
              Don't just see what's wrong. See how to fix it. Our AI rewrites your bullet points to match the job.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
        <p>© 2026 ResuMatch Zero. Built for Job Seekers.</p>
      </footer>
    </main>
  );
}
