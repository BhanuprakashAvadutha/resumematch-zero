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
import ImportResume from "./ImportResume";
import { Resume } from "@/types/resume";
import {
    Save,
    Download,
    Eye,
    EyeOff,
    FileText,
    Plus,
    Trash2,
    Check,
    ChevronDown,
    Upload
} from "lucide-react";

export default function ResumeEditorLayout() {
    const { resume, updateResume, save, isDirty, listSaved, load, createNew, deleteResume } = useResume();
    const [showPreview, setShowPreview] = useState(true);
    const [showSavedList, setShowSavedList] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [showImportModal, setShowImportModal] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleImport = (data: Partial<Resume>) => {
        // Merge imported data with existing resume
        updateResume({
            full_name: data.full_name || resume.full_name,
            email: data.email || resume.email,
            phone: data.phone || resume.phone,
            location: data.location || resume.location,
            summary: data.summary || resume.summary,
            links: data.links && data.links.length > 0 ? data.links : resume.links,
            skills: data.skills && data.skills.length > 0 ? data.skills : resume.skills,
            experiences: data.experiences && data.experiences.length > 0 ? data.experiences : resume.experiences,
            education: data.education && data.education.length > 0 ? data.education : resume.education,
            projects: data.projects && data.projects.length > 0 ? data.projects : resume.projects,
            certifications: data.certifications && data.certifications.length > 0 ? data.certifications : resume.certifications,
        });
    };

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

        // Clone the content to avoid modifying the original
        const clonedContent = previewContent.cloneNode(true) as HTMLElement;

        // Remove any inline styles that might interfere
        clonedContent.style.cssText = '';
        clonedContent.className = 'resume-content';

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>${resume.full_name || 'Resume'} - Resume</title>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;600&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        @page { 
            size: letter; 
            margin: 0.5in 0.6in; 
        }
        
        body { 
            font-family: 'Georgia', 'Times New Roman', serif; 
            font-size: 11pt;
            line-height: 1.35;
            color: #1a1a1a;
            background: white;
        }
        
        .resume-content {
            max-width: 100%;
            padding: 0;
            background: white;
        }
        
        /* Header Styles */
        header {
            text-align: center;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 10px;
            margin-bottom: 12px;
        }
        
        header h1 {
            font-size: 22pt;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
        }
        
        header a {
            color: #1a1a1a;
            text-decoration: none;
        }
        
        header a:hover {
            text-decoration: underline;
        }
        
        header .links a {
            color: #0066cc;
        }
        
        /* Section Headers */
        h2 {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1a1a1a;
            border-bottom: 1px solid #666;
            padding-bottom: 2px;
            margin-bottom: 8px;
        }
        
        section {
            margin-bottom: 12px;
        }
        
        /* Entry Headers */
        h3 {
            font-size: 11pt;
            font-weight: bold;
            color: #1a1a1a;
        }
        
        /* Lists */
        ul {
            margin-left: 18px;
            margin-top: 4px;
        }
        
        li {
            margin-bottom: 3px;
            padding-left: 4px;
            text-align: justify;
        }
        
        /* Layout helpers */
        .flex {
            display: flex;
        }
        
        .justify-between {
            justify-content: space-between;
        }
        
        .items-baseline {
            align-items: baseline;
        }
        
        .text-sm {
            font-size: 10.5pt;
        }
        
        .italic {
            font-style: italic;
        }
        
        .font-semibold {
            font-weight: 600;
        }
        
        .font-bold {
            font-weight: bold;
        }
        
        .space-y-3 > * + * {
            margin-top: 10px;
        }
        
        .space-y-2 > * + * {
            margin-top: 6px;
        }
        
        .space-y-1 > * + * {
            margin-top: 3px;
        }
        
        .gap-x-3 {
            column-gap: 12px;
        }
        
        .gap-x-4 {
            column-gap: 16px;
        }
        
        .flex-wrap {
            flex-wrap: wrap;
        }
        
        .justify-center {
            justify-content: center;
        }
        
        .text-center {
            text-align: center;
        }
        
        .mt-2 {
            margin-top: 6px;
        }
        
        .mb-2 {
            margin-bottom: 6px;
        }
        
        .mb-4 {
            margin-bottom: 12px;
        }
        
        .ml-4 {
            margin-left: 16px;
        }
        
        .pl-1 {
            padding-left: 4px;
        }
        
        .mt-1 {
            margin-top: 4px;
        }
        
        .pb-0\.5 {
            padding-bottom: 2px;
        }
        
        /* Color classes */
        .text-gray-600 {
            color: #4a4a4a;
        }
        
        .text-gray-700 {
            color: #374151;
        }
        
        .text-gray-800 {
            color: #1f2937;
        }
        
        .text-gray-900 {
            color: #1a1a1a;
        }
        
        .text-blue-700 {
            color: #0066cc;
        }
        
        /* Print specific */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            a {
                text-decoration: none;
            }
            
            .resume-content {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    ${clonedContent.outerHTML}
</body>
</html>
    `);

        printWindow.document.close();

        // Wait for fonts to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 500);
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
                                            <button
                                                onClick={() => { setShowImportModal(true); setShowSavedList(false); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-400 hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Import Resume
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

            {/* Import Resume Modal */}
            {showImportModal && (
                <ImportResume
                    onImport={handleImport}
                    onClose={() => setShowImportModal(false)}
                />
            )}
        </div>
    );
}
