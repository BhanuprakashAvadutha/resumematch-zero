"use client";
import { useResume } from "./ResumeContext";
import { formatDateForDisplay } from "./MonthPicker";

export default function ResumePreview() {
    const { resume } = useResume();

    // Format date range for display
    const formatDateRange = (startDate: string, endDate: string): string => {
        const start = formatDateForDisplay(startDate);
        const end = formatDateForDisplay(endDate);
        if (!start && !end) return "";
        if (!end) return start;
        if (!start) return end;
        return `${start} – ${end}`;
    };

    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 p-8 shadow-xl rounded-lg max-w-[8.5in] mx-auto print:shadow-none print:rounded-none"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.4 }}
        >
            {/* Header */}
            <header className="text-center border-b-2 border-gray-800 pb-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {resume.full_name || "Your Name"}
                </h1>

                {/* Contact Info Row */}
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-gray-700">
                    {resume.email && (
                        <a
                            href={`mailto:${resume.email}`}
                            className="hover:text-blue-600 hover:underline"
                            style={{ color: '#374151' }}
                        >
                            ✉ {resume.email}
                        </a>
                    )}
                    {resume.phone && (
                        <a
                            href={`tel:${resume.phone.replace(/\D/g, '')}`}
                            className="hover:text-blue-600"
                            style={{ color: '#374151' }}
                        >
                            ☎ {resume.phone}
                        </a>
                    )}
                    {resume.location && (
                        <span>📍 {resume.location}</span>
                    )}
                </div>

                {/* Links Row */}
                {resume.links.length > 0 && resume.links.some(l => l.url) && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm">
                        {resume.links.filter(l => l.url).map((link, i) => (
                            <a
                                key={i}
                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-800 hover:underline"
                                style={{ color: '#1d4ed8' }}
                            >
                                {link.label || link.url}
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {/* Summary */}
            {resume.summary && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-800">
                        {resume.summary}
                    </p>
                </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && resume.skills.some(s => s.items.length > 0) && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Skills
                    </h2>
                    <div className="space-y-1">
                        {resume.skills.filter(s => s.items.length > 0).map((category, i) => (
                            <p key={i} className="text-sm">
                                <span className="font-semibold text-gray-900">{category.category}:</span>{" "}
                                <span className="text-gray-700">{category.items.join(", ")}</span>
                            </p>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {resume.experiences.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Work Experience
                    </h2>
                    <div className="space-y-3">
                        {resume.experiences.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-gray-900">{exp.title || "Position"}</h3>
                                    <span className="text-sm text-gray-700 font-medium">
                                        {formatDateRange(exp.start_date, exp.end_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <span className="italic text-gray-700">{exp.company}</span>
                                    {exp.location && <span className="text-gray-600">{exp.location}</span>}
                                </div>
                                {exp.bullets.filter(b => b.trim()).length > 0 && (
                                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                                        {exp.bullets.filter(b => b.trim()).map((bullet, j) => (
                                            <li key={j} className="text-sm text-gray-800 pl-1">{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {resume.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-gray-900">{proj.name || "Project"}</h3>
                                    {proj.date_range && (
                                        <span className="text-sm text-gray-700">{formatDateForDisplay(proj.date_range)}</span>
                                    )}
                                </div>
                                {proj.bullets.filter(b => b.trim()).length > 0 && (
                                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                                        {proj.bullets.filter(b => b.trim()).map((bullet, j) => (
                                            <li key={j} className="text-sm text-gray-800 pl-1">{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Education
                    </h2>
                    <div className="space-y-2">
                        {resume.education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                                    <span className="text-sm text-gray-700">
                                        {formatDateRange(edu.start_date || "", edu.end_date || "") || edu.date_range}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <span className="italic text-gray-700">{edu.institution}</span>
                                    {edu.gpa && <span className="text-gray-600">GPA: {edu.gpa}</span>}
                                </div>
                                {edu.notes && (
                                    <p className="text-sm text-gray-600 mt-0.5 italic">{edu.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && resume.certifications.some(c => c.name) && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Certifications
                    </h2>
                    <div className="space-y-1">
                        {resume.certifications.filter(c => c.name).map((cert, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>
                                    <span className="font-semibold text-gray-900">{cert.name}</span>
                                    {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
                                </span>
                                {cert.date && <span className="text-gray-600">{formatDateForDisplay(cert.date)}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Awards */}
            {resume.awards.length > 0 && resume.awards.some(a => a.title) && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 mb-2 pb-0.5">
                        Awards & Honors
                    </h2>
                    <div className="space-y-1">
                        {resume.awards.filter(a => a.title).map((award, i) => (
                            <div key={i} className="text-sm">
                                <div className="flex justify-between">
                                    <span>
                                        <span className="font-semibold text-gray-900">{award.title}</span>
                                        {award.issuer && <span className="text-gray-600"> – {award.issuer}</span>}
                                    </span>
                                    {award.date && <span className="text-gray-600">{formatDateForDisplay(award.date)}</span>}
                                </div>
                                {award.description && (
                                    <p className="text-gray-600 text-xs mt-0.5 italic">{award.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
