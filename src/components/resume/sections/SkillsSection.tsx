"use client";
import { useResume } from "../ResumeContext";
import { SkillCategory, createEmptySkillCategory } from "@/types/resume";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

interface SkillCategoryCardProps {
    category: SkillCategory;
    onUpdate: (category: SkillCategory) => void;
    onDelete: () => void;
}

function SkillCategoryCard({ category, onUpdate, onDelete }: SkillCategoryCardProps) {
    const [newSkill, setNewSkill] = useState("");

    const addSkill = () => {
        if (newSkill.trim()) {
            onUpdate({
                ...category,
                items: [...category.items, newSkill.trim()]
            });
            setNewSkill("");
        }
    };

    const removeSkill = (index: number) => {
        onUpdate({
            ...category,
            items: category.items.filter((_, i) => i !== index)
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={category.category}
                    onChange={(e) => onUpdate({ ...category, category: e.target.value })}
                    placeholder="Category name (e.g., Technical Skills)"
                    className="flex-1 bg-transparent border-b border-gray-600 px-1 py-1 text-white font-medium placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                    onClick={onDelete}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2">
                {category.items.map((skill, index) => (
                    <span
                        key={index}
                        className="group flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-sm"
                    >
                        {skill}
                        <button
                            onClick={() => removeSkill(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {/* Add skill input */}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add skill..."
                        className="w-24 bg-transparent border-b border-gray-600 px-1 py-1 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:w-32 transition-all"
                    />
                    <button
                        onClick={addSkill}
                        className="ml-1 p-1 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SkillsSection() {
    const { resume, updateSection } = useResume();

    const addCategory = () => {
        const newCategory: SkillCategory = {
            ...createEmptySkillCategory(),
            id: generateId(),
            sort_order: resume.skills.length
        };
        updateSection("skills", [...resume.skills, newCategory]);
    };

    const updateCategory = (index: number, category: SkillCategory) => {
        const newSkills = [...resume.skills];
        newSkills[index] = category;
        updateSection("skills", newSkills);
    };

    const deleteCategory = (index: number) => {
        updateSection("skills", resume.skills.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">3</span>
                    Skills
                </h2>
                <button
                    onClick={addCategory}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {resume.skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No skills added yet.</p>
                    <button
                        onClick={addCategory}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                        Add your first skill category
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {resume.skills.map((category, index) => (
                        <SkillCategoryCard
                            key={category.id}
                            category={category}
                            onUpdate={(updated) => updateCategory(index, updated)}
                            onDelete={() => deleteCategory(index)}
                        />
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Tip: Group skills by category (e.g., &quot;Programming Languages&quot;, &quot;Tools&quot;, &quot;Soft Skills&quot;). Press Enter to quickly add skills.
            </p>
        </div>
    );
}
