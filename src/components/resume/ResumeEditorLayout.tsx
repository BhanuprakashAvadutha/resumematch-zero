"use client";
import { useState, useRef } from "react";
import { useResume } from "./ResumeContext";
import HeaderSection from "./sections/HeaderSection";
import SummarySection from "./sections/SummarySection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ProjectsSection from "./sections/ProjectsSection";
import CertificationsSection from "./sections/CertificationsSection";
import ResumePreview from "./ResumePreview";
import ScorePanel from "./ScorePanel";
import AvoidedWordsPanel from "./AvoidedWordsPanel";
import JDMatcherPanel from "./JDMatcherPanel";
import {
    Save,
    Download,
    Eye,
    EyeOff,
    FileText,
    Plus,
    Trash2,
    Check,
    ChevronDown
} from "lucide-react";

export default function ResumeEditorLayout() {
    const { resume, updateResume, save, isDirty, listSaved, load, createNew, deleteResume } = useResume();
    const [showPreview, setShowPreview] = useState(true);
    const [showSavedList, setShowSavedList] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const previewRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        setSaveStatus('saving');
        save();
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const previewContent = document.getElementById('resume-preview');
        if (!previewContent) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.full_name || 'Resume'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; }
            @page { size: letter; margin: 0.5in; }
            ${previewContent.querySelector('style')?.textContent || ''}
          </style>
        </head>
        <body>
          ${previewContent.outerHTML}
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const savedResumes = listSaved();

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Title & Resume Selector */}
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Resume Builder
                            </h1>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSavedList(!showSavedList)}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300 transition-colors"
                                >
                                    <span className="max-w-[150px] truncate">
                                        {resume.title || 'Untitled Resume'}
                                    </span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showSavedList && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                        <div className="p-2 border-b border-gray-700">
                                            <button
                                                onClick={() => { createNew(); setShowSavedList(false); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                New Resume
                                            </button>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {savedResumes.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className={`flex items-center justify-between px-3 py-2 hover:bg-gray-700 ${r.id === resume.id ? 'bg-gray-700/50' : ''
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => { load(r.id); setShowSavedList(false); }}
                                                        className="flex-1 text-left text-sm text-gray-300 truncate"
                                                    >
                                                        {r.title}
                                                    </button>
                                                    {savedResumes.length > 1 && (
                                                        <button
                                                            onClick={() => deleteResume(r.id)}
                                                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Resume Title Edit */}
                            <input
                                type="text"
                                value={resume.title}
                                onChange={(e) => updateResume({ title: e.target.value })}
                                className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 px-1 py-0.5 text-sm text-gray-400 focus:text-white transition-colors outline-none"
                                placeholder="Resume title..."
                            />
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={!isDirty && saveStatus === 'idle'}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${saveStatus === 'saved'
                                        ? 'bg-green-500/20 text-green-400'
                                        : isDirty
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-700 text-gray-400'
                                    }`}
                            >
                                {saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                <span className="hidden sm:inline">
                                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
                                </span>
                            </button>

                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
                    {/* Left: Editor */}
                    <div className="space-y-6">
                        <HeaderSection />
                        <SummarySection />
                        <SkillsSection />
                        <ExperienceSection />
                        <EducationSection />
                        <ProjectsSection />
                        <CertificationsSection />
                    </div>

                    {/* Right: Preview & Intelligence */}
                    {showPreview && (
                        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
                            {/* Intelligence Panels */}
                            <ScorePanel />
                            <AvoidedWordsPanel />
                            <JDMatcherPanel />

                            {/* Preview */}
                            <div className="border border-gray-800 rounded-xl overflow-hidden">
                                <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Live Preview</span>
                                    <button
                                        onClick={handlePrint}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                                <div
                                    ref={previewRef}
                                    className="max-h-[600px] overflow-y-auto bg-gray-100 p-4"
                                    style={{ transform: 'scale(0.6)', transformOrigin: 'top center', marginBottom: '-40%' }}
                                >
                                    <ResumePreview />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
