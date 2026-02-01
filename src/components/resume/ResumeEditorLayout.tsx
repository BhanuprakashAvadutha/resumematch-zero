"use client";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { useResume } from "./ResumeContext";
import { formatDateForDisplay } from "./MonthPicker";
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
            // Initialize PDF - A4 size, Millimeters
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Layout Constants
            const marginX = 15;
            const pageWidth = 210;
            const contentWidth = pageWidth - (marginX * 2);
            const lineHeight = 5; // Standard line height

            // Fonts
            pdf.setFont("times"); // Matches the serif look of the image

            let cursorY = 15; // Start position

            // Helper: Check page break
            const checkPageBreak = (spaceNeeded: number) => {
                if (cursorY + spaceNeeded > 280) { // Leave bottom margin
                    pdf.addPage();
                    cursorY = 20; // Resume at top margin
                }
            };

            // Helper: Add Section Header
            const addSectionHeader = (title: string) => {
                checkPageBreak(10);
                cursorY += 4;
                pdf.setFont("times", "bold");
                pdf.setFontSize(11);
                pdf.text(title.toUpperCase(), marginX, cursorY);

                // Horizontal Line
                cursorY += 1.5;
                pdf.setLineWidth(0.5);
                pdf.line(marginX, cursorY, marginX + contentWidth, cursorY);

                cursorY += 5; // Space after header
                pdf.setFont("times", "normal");
            };

            // Helper: Format Date Range
            const formatDateRange = (start: string, end: string) => {
                const s = formatDateForDisplay(start);
                const e = formatDateForDisplay(end);
                if (!s && !e) return "";
                if (!e) return s;
                if (!s) return e;
                return `${s} - ${e}`;
            };

            // ======================
            // 1. HEADER
            // ======================
            // Name
            pdf.setFont("times", "bold");
            pdf.setFontSize(22);
            pdf.setTextColor(0, 0, 0); // Black
            const name = resume.full_name || "Your Name";
            const nameWidth = pdf.getTextWidth(name);
            pdf.text(name, (pageWidth - nameWidth) / 2, cursorY);
            cursorY += 6;

            // Contact Info line
            pdf.setFont("times", "normal");
            pdf.setFontSize(10);

            const contactParts = [];
            if (resume.location) contactParts.push(resume.location);
            if (resume.email) contactParts.push(resume.email);
            if (resume.phone) contactParts.push(resume.phone);

            const contactText = contactParts.join(" • ");
            const contactWidth = pdf.getTextWidth(contactText);
            const startX = (pageWidth - contactWidth) / 2;

            // We draw manually to make links clickable
            let currentX = startX;
            contactParts.forEach((part, index) => {
                if (part === resume.email) {
                    pdf.setTextColor(29, 78, 216); // Blue link
                    pdf.textWithLink(part, currentX, cursorY, { url: `mailto:${part}` });
                    pdf.setTextColor(0, 0, 0);
                } else if (part === resume.phone) {
                    pdf.text(part, currentX, cursorY);
                } else {
                    pdf.text(part, currentX, cursorY);
                }

                currentX += pdf.getTextWidth(part);
                if (index < contactParts.length - 1) {
                    pdf.text(" • ", currentX, cursorY);
                    currentX += pdf.getTextWidth(" • ");
                }
            });
            cursorY += 5;

            // Links Line (LinkedIn, Portfolio, etc.)
            if (resume.links && resume.links.length > 0) {
                const validLinks = resume.links.filter(l => l.url);
                if (validLinks.length > 0) {
                    // Calculate total width first to center
                    let totalLinkWidth = 0;
                    validLinks.forEach((link, i) => {
                        const label = link.label || link.url;
                        totalLinkWidth += pdf.getTextWidth(label);
                        if (i < validLinks.length - 1) totalLinkWidth += pdf.getTextWidth(" • ");
                    });

                    let linkX = (pageWidth - totalLinkWidth) / 2;

                    pdf.setTextColor(29, 78, 216); // Blue
                    validLinks.forEach((link, i) => {
                        const label = link.label || link.url;
                        const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                        pdf.textWithLink(label, linkX, cursorY, { url });
                        linkX += pdf.getTextWidth(label);

                        if (i < validLinks.length - 1) {
                            pdf.setTextColor(0, 0, 0);
                            pdf.text(" • ", linkX, cursorY);
                            linkX += pdf.getTextWidth(" • ");
                            pdf.setTextColor(29, 78, 216);
                        }
                    });
                    pdf.setTextColor(0, 0, 0); // Reset to black
                    cursorY += 8;
                } else {
                    cursorY += 3;
                }
            } else {
                cursorY += 3;
            }

            // ======================
            // 2. SUMMARY
            // ======================
            if (resume.summary) {
                // No specific header for summary in the image, but usually standard.
                // Image doesn't show "SUMMARY" header explicitly but text block at top. 
                // However, standard resumes often have it. The image shows text block immediately after header.
                // Let's print the text.
                pdf.setFont("times", "normal");
                pdf.setFontSize(10.5);
                const splitSummary = pdf.splitTextToSize(resume.summary, contentWidth);
                checkPageBreak(splitSummary.length * 4);
                pdf.text(splitSummary, marginX, cursorY, { align: 'justify', maxWidth: contentWidth });
                cursorY += (splitSummary.length * 4) + 4;
            }

            // ======================
            // 3. SKILLS
            // ======================
            if (resume.skills && resume.skills.length > 0 && resume.skills.some(s => s.items.length > 0)) {
                addSectionHeader("SKILLS");
                pdf.setFontSize(10.5);

                resume.skills.forEach(skillGroup => {
                    if (skillGroup.items.length === 0) return;

                    checkPageBreak(5);
                    const category = `${skillGroup.category}:`;
                    const items = skillGroup.items.join(", ");

                    pdf.setFont("times", "bold");
                    pdf.text(category, marginX, cursorY);

                    const catWidth = pdf.getTextWidth(category);
                    pdf.setFont("times", "normal");

                    // Wrap items if they exceed line
                    const itemMaxWidth = contentWidth - catWidth - 2;
                    const splitItems = pdf.splitTextToSize(items, itemMaxWidth);

                    pdf.text(splitItems, marginX + catWidth + 2, cursorY);
                    cursorY += (splitItems.length * 4.5);
                });
                cursorY += 2;
            }

            // ======================
            // 4. EXPERIENCE
            // ======================
            if (resume.experiences && resume.experiences.length > 0) {
                addSectionHeader("WORK EXPERIENCE");

                resume.experiences.forEach(exp => {
                    // Line 1: Role & Date
                    checkPageBreak(15); // Min space for title

                    pdf.setFont("times", "bold");
                    pdf.setFontSize(11); // Slightly larger for role matching image
                    pdf.text(exp.title, marginX, cursorY);

                    const dateStr = formatDateRange(exp.start_date, exp.end_date);
                    pdf.setFontSize(10.5);
                    pdf.text(dateStr, pageWidth - marginX, cursorY, { align: "right" });

                    cursorY += 5;

                    // Line 2: Company & Location
                    pdf.setFont("times", "normal"); // Image shows company as normal or semi-bold. Let's stick to normal but maybe bold text? 
                    // Wait, image: "Pepelead (PepperAds)" is Bold? No, looks slightly distinct.
                    // Let's use Bold for Company as per standard high quality resumes, or matching image carefully.
                    // Image: "Data Analyst" (Bold) ... Date (Bold).
                    // Next line: "Pepeleads" (Bold) ... "India" (Bold?)
                    // Let's make Company Name Bold as well to stand out.
                    pdf.setFont("times", "bold");
                    pdf.text(exp.company, marginX, cursorY);

                    if (exp.location) {
                        pdf.text(exp.location, pageWidth - marginX, cursorY, { align: "right" });
                    }
                    cursorY += 5;

                    // Bullets
                    pdf.setFont("times", "normal");
                    pdf.setFontSize(10.5);

                    exp.bullets.forEach(bullet => {
                        if (!bullet.trim()) return;

                        // Simple bullet handling
                        // Clean bullet text
                        const cleanBullet = bullet.trim();

                        // Calculate wrapped text dimensions
                        // Indent bullet text by 5mm
                        const bulletIndent = 5;
                        const textWidth = contentWidth - bulletIndent;
                        const splitText = pdf.splitTextToSize(cleanBullet, textWidth);

                        checkPageBreak(splitText.length * 4);

                        // Draw Bullet
                        pdf.text("•", marginX + 1, cursorY);

                        // Draw Text
                        pdf.text(splitText, marginX + bulletIndent, cursorY, { maxWidth: textWidth, align: "justify" });

                        cursorY += (splitText.length * 4.2) + 1; // 4.2 spacing + 1 padding
                    });

                    cursorY += 3; // Space between jobs
                });
            }

            // ======================
            // 5. PROJECTS
            // ======================
            if (resume.projects && resume.projects.length > 0) {
                addSectionHeader("PROJECTS");

                resume.projects.forEach(proj => {
                    checkPageBreak(15);

                    // Line 1: Name & Date
                    pdf.setFont("times", "bold");
                    pdf.setFontSize(11);
                    pdf.text(proj.name, marginX, cursorY);

                    if (proj.date_range) {
                        const dateStr = formatDateForDisplay(proj.date_range);
                        pdf.setFontSize(10.5);
                        pdf.text(dateStr, pageWidth - marginX, cursorY, { align: "right" });
                    }
                    cursorY += 5;

                    // Bullets
                    pdf.setFont("times", "normal");
                    pdf.setFontSize(10.5);

                    proj.bullets.forEach(bullet => {
                        if (!bullet.trim()) return;
                        const cleanBullet = bullet.trim();
                        const bulletIndent = 5;
                        const textWidth = contentWidth - bulletIndent;
                        const splitText = pdf.splitTextToSize(cleanBullet, textWidth);

                        checkPageBreak(splitText.length * 4);

                        pdf.text("•", marginX + 1, cursorY);
                        pdf.text(splitText, marginX + bulletIndent, cursorY, { maxWidth: textWidth, align: "justify" });

                        cursorY += (splitText.length * 4.2) + 1;
                    });
                    cursorY += 3;
                });
            }

            // ======================
            // 6. EDUCATION
            // ======================
            if (resume.education && resume.education.length > 0) {
                addSectionHeader("EDUCATION");

                resume.education.forEach(edu => {
                    checkPageBreak(15);

                    // Line 1: Degree & Date
                    pdf.setFont("times", "bold");
                    pdf.setFontSize(11);
                    pdf.text(edu.degree, marginX, cursorY);

                    const dateStr = formatDateRange(edu.start_date || "", edu.end_date || "") || edu.date_range;
                    pdf.setFontSize(10.5);
                    pdf.text(dateStr, pageWidth - marginX, cursorY, { align: "right" });
                    cursorY += 5;

                    // Line 2: Institution & Location/GPA
                    pdf.setFont("times", "normal");
                    pdf.text(edu.institution, marginX, cursorY);

                    // GPA/Location on right? Image shows GPA usually under or right.
                    // Let's put formatting logic: "GPA: 6.96" on right.
                    let eduMeta = "";
                    // if (edu.location) eduMeta = edu.location;
                    if (edu.gpa) eduMeta += `GPA: ${edu.gpa}`;

                    if (eduMeta) {
                        pdf.text(eduMeta, pageWidth - marginX, cursorY, { align: "right" });
                    }

                    cursorY += 5;

                    if (edu.notes) {
                        pdf.setFont("times", "italic");
                        const splitNotes = pdf.splitTextToSize(edu.notes, contentWidth);
                        checkPageBreak(splitNotes.length * 4);
                        pdf.text(splitNotes, marginX, cursorY);
                        cursorY += (splitNotes.length * 4) + 1;
                        pdf.setFont("times", "normal");
                    }

                    cursorY += 2;
                });
            }

            // ======================
            // 7. CERTIFICATIONS / AWARDS (Optional, if space)
            // ======================
            if (resume.certifications && resume.certifications.length > 0 && resume.certifications.some(c => c.name)) {
                addSectionHeader("CERTIFICATIONS");
                pdf.setFontSize(10.5);
                resume.certifications.filter(c => c.name).forEach(cert => {
                    checkPageBreak(5);
                    const text = `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}`;
                    // Maybe put date on right?
                    pdf.text("• " + text, marginX + 1, cursorY);
                    if (cert.date) {
                        pdf.text(formatDateForDisplay(cert.date), pageWidth - marginX, cursorY, { align: "right" });
                    }
                    cursorY += 5;
                });
            }

            // Generate filename
            const fileName = resume.full_name
                ? `${resume.full_name.replace(/\s+/g, '_')}_Resume.pdf`
                : 'Resume.pdf';

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
        <div className="min-h-screen bg-[#0a0a0f] pb-24 sm:pb-0">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Title & Resume Selector */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <h1 className="text-lg font-semibold text-white flex items-center gap-2 shrink-0">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <span className="hidden sm:inline">Resume Builder</span>
                            </h1>

                            <div className="relative shrink-0">
                                <button
                                    onClick={() => setShowSavedList(!showSavedList)}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300 transition-colors max-w-[120px] sm:max-w-[200px]"
                                >
                                    <span className="truncate">
                                        {resume.title || 'Untitled Resume'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 shrink-0" />
                                </button>

                                {showSavedList && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
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

                            {/* Resume Title Edit - Hidden on very small screens if needed, or flexible */}
                            <input
                                type="text"
                                value={resume.title}
                                onChange={(e) => updateResume({ title: e.target.value })}
                                className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 px-1 py-0.5 text-sm text-gray-400 focus:text-white transition-colors outline-none min-w-0 flex-1 sm:flex-none"
                                placeholder="Edit title..."
                            />
                        </div>

                        {/* Right: Actions (Desktop Only) */}
                        <div className="hidden sm:flex items-center gap-2">
                            {/* Import Resume - Prominent Button */}
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden lg:inline">Import Resume</span>
                            </button>

                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span className="hidden lg:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
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
                                <span className="hidden lg:inline">
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
                                        <span className="hidden lg:inline">Generating...</span>
                                    </>
                                ) : downloadStatus === 'done' ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span className="hidden lg:inline">Downloaded!</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span className="hidden lg:inline">Download PDF</span>
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
                                    style={{ transform: 'none', transformOrigin: 'top center' }}
                                >
                                    {/* Removed fixed scale for mobile/responsiveness, CSS handling preferred */}
                                    <div className="origin-top scale-[0.55] sm:scale-75 lg:scale-100 w-[210mm] mx-auto">
                                        <ResumePreview />
                                    </div>
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

            {/* Mobile Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-t border-gray-800 p-2 sm:hidden pb-safe">
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-800"
                    >
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px]">Import</span>
                    </button>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${showPreview ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        {showPreview ? <EyeOff className="w-5 h-5 mb-1" /> : <Eye className="w-5 h-5 mb-1" />}
                        <span className="text-[10px]">Preview</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isDirty && saveStatus === 'idle'}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${isDirty ? 'text-blue-400' : 'text-gray-400'}`}
                    >
                        {saveStatus === 'saved' ? <Check className="w-5 h-5 mb-1 text-green-500" /> : <Save className="w-5 h-5 mb-1" />}
                        <span className="text-[10px]">
                            {saveStatus === 'saved' ? 'Saved' : 'Save'}
                        </span>
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloadStatus === 'generating'}
                        className="flex flex-col items-center justify-center p-2 rounded-lg text-purple-400 hover:bg-gray-800"
                    >
                        {downloadStatus === 'generating' ? (
                            <svg className="animate-spin w-5 h-5 mb-1" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <Download className="w-5 h-5 mb-1" />
                        )}
                        <span className="text-[10px]">Download</span>
                    </button>
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
