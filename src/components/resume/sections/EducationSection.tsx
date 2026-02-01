"use client";
import { useResume } from "../ResumeContext";
import { Education, createEmptyEducation } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

interface EducationCardProps {
    education: Education;
    onUpdate: (education: Education) => void;
    onDelete: () => void;
}

function EducationCard({ education, onUpdate, onDelete }: EducationCardProps) {
    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-5 space-y-4">
            <div className="flex items-start gap-3">
                <div className="text-gray-600 cursor-grab mt-2">
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                    {/* Degree & Institution Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={education.degree}
                            onChange={(e) => onUpdate({ ...education, degree: e.target.value })}
                            placeholder="Degree (e.g., B.S. Computer Science)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-medium placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={education.institution}
                            onChange={(e) => onUpdate({ ...education, institution: e.target.value })}
                            placeholder="Institution Name"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location, Date, GPA Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={education.location || ""}
                            onChange={(e) => onUpdate({ ...education, location: e.target.value })}
                            placeholder="Location"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={education.date_range}
                            onChange={(e) => onUpdate({ ...education, date_range: e.target.value })}
                            placeholder="Date Range (e.g., 2019 - 2023)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={education.gpa || ""}
                            onChange={(e) => onUpdate({ ...education, gpa: e.target.value })}
                            placeholder="GPA (optional)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Notes */}
                    <textarea
                        value={education.notes || ""}
                        onChange={(e) => onUpdate({ ...education, notes: e.target.value })}
                        placeholder="Honors, relevant coursework, activities (optional)"
                        rows={2}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                </div>

                <button
                    onClick={onDelete}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function EducationSection() {
    const { resume, updateSection } = useResume();

    const addEducation = () => {
        const newEducation: Education = {
            ...createEmptyEducation(),
            id: generateId(),
            sort_order: resume.education.length
        };
        updateSection("education", [...resume.education, newEducation]);
    };

    const updateEducation = (index: number, education: Education) => {
        const newEducation = [...resume.education];
        newEducation[index] = education;
        updateSection("education", newEducation);
    };

    const deleteEducation = (index: number) => {
        updateSection("education", resume.education.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">5</span>
                    Education
                </h2>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Education
                </button>
            </div>

            {resume.education.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No education added yet.</p>
                    <button
                        onClick={addEducation}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                        Add your education
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                        <EducationCard
                            key={edu.id}
                            education={edu}
                            onUpdate={(updated) => updateEducation(index, updated)}
                            onDelete={() => deleteEducation(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
