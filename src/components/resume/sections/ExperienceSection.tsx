"use client";
import { useResume } from "../ResumeContext";
import { Experience, createEmptyExperience } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

interface ExperienceCardProps {
    experience: Experience;
    onUpdate: (experience: Experience) => void;
    onDelete: () => void;
    index: number;
}

function ExperienceCard({ experience, onUpdate, onDelete, index }: ExperienceCardProps) {
    const updateBullet = (bulletIndex: number, value: string) => {
        const newBullets = [...experience.bullets];
        newBullets[bulletIndex] = value;
        onUpdate({ ...experience, bullets: newBullets });
    };

    const addBullet = () => {
        onUpdate({ ...experience, bullets: [...experience.bullets, ""] });
    };

    const removeBullet = (bulletIndex: number) => {
        if (experience.bullets.length > 1) {
            onUpdate({ ...experience, bullets: experience.bullets.filter((_, i) => i !== bulletIndex) });
        }
    };

    const handleBulletKeyDown = (e: React.KeyboardEvent, bulletIndex: number) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addBullet();
        } else if (e.key === "Backspace" && experience.bullets[bulletIndex] === "" && experience.bullets.length > 1) {
            e.preventDefault();
            removeBullet(bulletIndex);
        }
    };

    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-5 space-y-4">
            <div className="flex items-start gap-3">
                <div className="text-gray-600 cursor-grab mt-2">
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-4">
                    {/* Title & Company Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={experience.title}
                            onChange={(e) => onUpdate({ ...experience, title: e.target.value })}
                            placeholder="Job Title"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-medium placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={experience.company}
                            onChange={(e) => onUpdate({ ...experience, company: e.target.value })}
                            placeholder="Company Name"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location & Dates Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={experience.location || ""}
                            onChange={(e) => onUpdate({ ...experience, location: e.target.value })}
                            placeholder="Location"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={experience.start_date}
                            onChange={(e) => onUpdate({ ...experience, start_date: e.target.value })}
                            placeholder="Start Date (e.g., Jan 2022)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={experience.end_date}
                            onChange={(e) => onUpdate({ ...experience, end_date: e.target.value })}
                            placeholder="End Date (or Present)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Accomplishments</label>
                        {experience.bullets.map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="flex items-start gap-2">
                                <span className="text-gray-500 mt-2.5">•</span>
                                <textarea
                                    value={bullet}
                                    onChange={(e) => updateBullet(bulletIndex, e.target.value)}
                                    onKeyDown={(e) => handleBulletKeyDown(e, bulletIndex)}
                                    placeholder={bulletIndex === 0 ? "Start with an action verb (e.g., Led, Built, Increased...)" : "Add another accomplishment..."}
                                    rows={2}
                                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                                {experience.bullets.length > 1 && (
                                    <button
                                        onClick={() => removeBullet(bulletIndex)}
                                        className="mt-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addBullet}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors ml-4"
                        >
                            <Plus className="w-3 h-3" />
                            Add Bullet
                        </button>
                    </div>
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

export default function ExperienceSection() {
    const { resume, updateSection } = useResume();

    const addExperience = () => {
        const newExperience: Experience = {
            ...createEmptyExperience(),
            id: generateId(),
            sort_order: resume.experiences.length
        };
        updateSection("experiences", [...resume.experiences, newExperience]);
    };

    const updateExperience = (index: number, experience: Experience) => {
        const newExperiences = [...resume.experiences];
        newExperiences[index] = experience;
        updateSection("experiences", newExperiences);
    };

    const deleteExperience = (index: number) => {
        updateSection("experiences", resume.experiences.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">4</span>
                    Work Experience
                </h2>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            {resume.experiences.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No work experience added yet.</p>
                    <button
                        onClick={addExperience}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                        Add your first experience
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {resume.experiences.map((experience, index) => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            index={index}
                            onUpdate={(updated) => updateExperience(index, updated)}
                            onDelete={() => deleteExperience(index)}
                        />
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Tip: Use bullet points to highlight achievements, not just responsibilities. Include metrics when possible.
            </p>
        </div>
    );
}
