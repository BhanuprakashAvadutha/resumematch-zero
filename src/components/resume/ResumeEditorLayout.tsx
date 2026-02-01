"use client";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');
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

    const handleDownloadPDF = async () => {
        setDownloadStatus('generating');

        try {
            const previewContent = document.getElementById('resume-preview');
            if (!previewContent) {
                setDownloadStatus('idle');
                return;
            }

            // Create a temporary container for PDF generation
            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0';
            pdfContainer.style.width = '8.5in';
            pdfContainer.style.background = 'white';
            pdfContainer.style.padding = '0.5in 0.6in';

            // Clone and prepare content
            const clonedContent = previewContent.cloneNode(true) as HTMLElement;
            clonedContent.style.transform = 'none';
            clonedContent.style.transformOrigin = 'initial';
            clonedContent.style.margin = '0';
            clonedContent.style.boxShadow = 'none';
            clonedContent.style.borderRadius = '0';

            pdfContainer.appendChild(clonedContent);
            document.body.appendChild(pdfContainer);

            // Generate high-quality canvas
            const canvas = await html2canvas(pdfContainer, {
                scale: 2, // Higher resolution for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 816, // 8.5 inches at 96 DPI
            });

            // Remove temporary container
            document.body.removeChild(pdfContainer);

            // Calculate dimensions for Letter size (8.5 x 11 inches)
            const imgWidth = 210; // A4 width in mm (close to letter)
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Handle multi-page if content is longer than one page
            let heightLeft = imgHeight;
            let position = 0;
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Generate filename based on user's name
            const fileName = resume.full_name
                ? `${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`
                : 'Resume.pdf';

            // Download the PDF
            pdf.save(fileName);

            setDownloadStatus('done');
            setTimeout(() => setDownloadStatus('idle'), 2000);
        } catch (error) {
            console.error('PDF generation error:', error);
            setDownloadStatus('idle');
            alert('Failed to generate PDF. Please try again.');
        }
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
                            {/* Import Resume - Prominent Button */}
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Import Resume</span>
                            </button>

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
                                onClick={handleDownloadPDF}
                                disabled={downloadStatus === 'generating'}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-colors ${downloadStatus === 'generating'
                                        ? 'bg-purple-400 cursor-wait'
                                        : downloadStatus === 'done'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-purple-500 hover:bg-purple-600'
                                    } text-white`}
                            >
                                {downloadStatus === 'generating' ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span className="hidden sm:inline">Generating...</span>
                                    </>
                                ) : downloadStatus === 'done' ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span className="hidden sm:inline">Downloaded!</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Download PDF</span>
                                    </>
                                )}
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
                        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                            {/* Preview First - More Prominent */}
                            <div className="border border-gray-800 rounded-xl overflow-hidden">
                                <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Live Preview</span>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={downloadStatus === 'generating'}
                                        className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                                    >
                                        {downloadStatus === 'generating' ? 'Generating...' : 'Download PDF'}
                                    </button>
                                </div>
                                <div
                                    ref={previewRef}
                                    className="max-h-[400px] overflow-y-auto bg-gray-100 p-3"
                                    style={{ transform: 'scale(0.55)', transformOrigin: 'top center', marginBottom: '-45%' }}
                                >
                                    <ResumePreview />
                                </div>
                            </div>

                            {/* Compact Score Panel */}
                            <details className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                                <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-300 hover:bg-gray-800/50 flex items-center justify-between">
                                    <span>📊 Resume Score & Tips</span>
                                    <ChevronDown className="w-4 h-4" />
                                </summary>
                                <div className="border-t border-gray-800">
                                    <ScorePanel />
                                </div>
                            </details>

                            {/* Compact Other Panels */}
                            <details className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                                <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-300 hover:bg-gray-800/50 flex items-center justify-between">
                                    <span>⚠️ Words to Avoid</span>
                                    <ChevronDown className="w-4 h-4" />
                                </summary>
                                <div className="border-t border-gray-800">
                                    <AvoidedWordsPanel />
                                </div>
                            </details>

                            <details className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                                <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-300 hover:bg-gray-800/50 flex items-center justify-between">
                                    <span>🎯 JD Matcher</span>
                                    <ChevronDown className="w-4 h-4" />
                                </summary>
                                <div className="border-t border-gray-800">
                                    <JDMatcherPanel />
                                </div>
                            </details>
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
