"use client";
import { useResume } from "../ResumeContext";
import { Certification, createEmptyCertification, Award, createEmptyAward } from "@/types/resume";
import { Plus, Trash2, Award as AwardIcon, BadgeCheck } from "lucide-react";

function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

export default function CertificationsSection() {
    const { resume, updateSection } = useResume();

    // Certifications handlers
    const addCertification = () => {
        const newCert: Certification = {
            ...createEmptyCertification(),
            id: generateId(),
            sort_order: resume.certifications.length
        };
        updateSection("certifications", [...resume.certifications, newCert]);
    };

    const updateCertification = (index: number, cert: Certification) => {
        const newCerts = [...resume.certifications];
        newCerts[index] = cert;
        updateSection("certifications", newCerts);
    };

    const deleteCertification = (index: number) => {
        updateSection("certifications", resume.certifications.filter((_, i) => i !== index));
    };

    // Awards handlers
    const addAward = () => {
        const newAward: Award = {
            ...createEmptyAward(),
            id: generateId(),
            sort_order: resume.awards.length
        };
        updateSection("awards", [...resume.awards, newAward]);
    };

    const updateAward = (index: number, award: Award) => {
        const newAwards = [...resume.awards];
        newAwards[index] = award;
        updateSection("awards", newAwards);
    };

    const deleteAward = (index: number) => {
        updateSection("awards", resume.awards.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* Certifications */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                            <BadgeCheck className="w-4 h-4" />
                        </span>
                        Certifications
                    </h2>
                    <button
                        onClick={addCertification}
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {resume.certifications.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 text-sm">
                        No certifications added yet.{" "}
                        <button onClick={addCertification} className="text-blue-400 hover:text-blue-300">
                            Add one
                        </button>
                    </p>
                ) : (
                    <div className="space-y-3">
                        {resume.certifications.map((cert, index) => (
                            <div key={cert.id} className="flex items-start gap-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertification(index, { ...cert, name: e.target.value })}
                                        placeholder="Certification Name"
                                        className="md:col-span-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={cert.issuer || ""}
                                        onChange={(e) => updateCertification(index, { ...cert, issuer: e.target.value })}
                                        placeholder="Issuer (e.g., AWS, Google)"
                                        className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={cert.date || ""}
                                        onChange={(e) => updateCertification(index, { ...cert, date: e.target.value })}
                                        placeholder="Date (optional)"
                                        className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={() => deleteCertification(index)}
                                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Awards */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                            <AwardIcon className="w-4 h-4" />
                        </span>
                        Awards & Honors
                    </h2>
                    <button
                        onClick={addAward}
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {resume.awards.length === 0 ? (
                    <p className="text-center py-4 text-gray-500 text-sm">
                        No awards added yet.{" "}
                        <button onClick={addAward} className="text-blue-400 hover:text-blue-300">
                            Add one
                        </button>
                    </p>
                ) : (
                    <div className="space-y-3">
                        {resume.awards.map((award, index) => (
                            <div key={award.id} className="flex items-start gap-3 bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            value={award.title}
                                            onChange={(e) => updateAward(index, { ...award, title: e.target.value })}
                                            placeholder="Award Title"
                                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={award.issuer || ""}
                                            onChange={(e) => updateAward(index, { ...award, issuer: e.target.value })}
                                            placeholder="Issuing Organization"
                                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            value={award.date || ""}
                                            onChange={(e) => updateAward(index, { ...award, date: e.target.value })}
                                            placeholder="Date"
                                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <textarea
                                        value={award.description || ""}
                                        onChange={(e) => updateAward(index, { ...award, description: e.target.value })}
                                        placeholder="Description (optional)"
                                        rows={1}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                                <button
                                    onClick={() => deleteAward(index)}
                                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
