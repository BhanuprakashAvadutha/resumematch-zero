"use client";
import { useResume } from "./ResumeContext";
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";

export default function ResumePreview() {
    const { resume } = useResume();

    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 p-8 shadow-xl rounded-lg max-w-[8.5in] mx-auto print:shadow-none print:rounded-none"
            style={{ fontFamily: "'Times New Roman', serif" }}
        >
            {/* Header */}
            <header className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resume.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    {resume.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {resume.email}
                        </span>
                    )}
                    {resume.phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {resume.phone}
                        </span>
                    )}
                    {resume.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {resume.location}
                        </span>
                    )}
                </div>

                {resume.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-sm text-blue-600">
                        {resume.links.filter(l => l.url).map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                <LinkIcon className="w-3 h-3" />
                                {link.label || link.url}
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {/* Summary */}
            {resume.summary && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-700">
                        {resume.summary}
                    </p>
                </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Skills
                    </h2>
                    <div className="space-y-1">
                        {resume.skills.map((category, i) => (
                            <p key={i} className="text-sm">
                                <span className="font-semibold">{category.category}:</span>{" "}
                                <span className="text-gray-700">{category.items.join(", ")}</span>
                            </p>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {resume.experiences.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Work Experience
                    </h2>
                    <div className="space-y-3">
                        {resume.experiences.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold">{exp.title || "Position"}</h3>
                                    <span className="text-xs text-gray-600">
                                        {exp.start_date} – {exp.end_date}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <span className="italic text-gray-700">{exp.company}</span>
                                    {exp.location && <span className="text-xs text-gray-500">{exp.location}</span>}
                                </div>
                                {exp.bullets.filter(b => b.trim()).length > 0 && (
                                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                                        {exp.bullets.filter(b => b.trim()).map((bullet, j) => (
                                            <li key={j} className="text-sm text-gray-700">{bullet}</li>
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
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {resume.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold">{proj.name || "Project"}</h3>
                                    {proj.date_range && (
                                        <span className="text-xs text-gray-600">{proj.date_range}</span>
                                    )}
                                </div>
                                {proj.bullets.filter(b => b.trim()).length > 0 && (
                                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                                        {proj.bullets.filter(b => b.trim()).map((bullet, j) => (
                                            <li key={j} className="text-sm text-gray-700">{bullet}</li>
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
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Education
                    </h2>
                    <div className="space-y-2">
                        {resume.education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-bold">{edu.degree || "Degree"}</h3>
                                    <span className="text-xs text-gray-600">{edu.date_range}</span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <span className="italic text-gray-700">{edu.institution}</span>
                                    {edu.gpa && <span className="text-xs text-gray-600">GPA: {edu.gpa}</span>}
                                </div>
                                {edu.notes && (
                                    <p className="text-sm text-gray-600 mt-0.5">{edu.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Certifications
                    </h2>
                    <div className="space-y-1">
                        {resume.certifications.map((cert, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>
                                    <span className="font-semibold">{cert.name}</span>
                                    {cert.issuer && <span className="text-gray-600"> – {cert.issuer}</span>}
                                </span>
                                {cert.date && <span className="text-gray-500">{cert.date}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Awards */}
            {resume.awards.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mb-2">
                        Awards & Honors
                    </h2>
                    <div className="space-y-1">
                        {resume.awards.map((award, i) => (
                            <div key={i} className="text-sm">
                                <div className="flex justify-between">
                                    <span>
                                        <span className="font-semibold">{award.title}</span>
                                        {award.issuer && <span className="text-gray-600"> – {award.issuer}</span>}
                                    </span>
                                    {award.date && <span className="text-gray-500">{award.date}</span>}
                                </div>
                                {award.description && (
                                    <p className="text-gray-600 text-xs mt-0.5">{award.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
