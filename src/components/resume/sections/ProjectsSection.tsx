"use client";
import { useResume } from "../ResumeContext";
import { Project, createEmptyProject } from "@/types/resume";
import { Plus, Trash2, GripVertical } from "lucide-react";

function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

interface ProjectCardProps {
    project: Project;
    onUpdate: (project: Project) => void;
    onDelete: () => void;
}

function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
    const updateBullet = (bulletIndex: number, value: string) => {
        const newBullets = [...project.bullets];
        newBullets[bulletIndex] = value;
        onUpdate({ ...project, bullets: newBullets });
    };

    const addBullet = () => {
        onUpdate({ ...project, bullets: [...project.bullets, ""] });
    };

    const removeBullet = (bulletIndex: number) => {
        if (project.bullets.length > 1) {
            onUpdate({ ...project, bullets: project.bullets.filter((_, i) => i !== bulletIndex) });
        }
    };

    const handleBulletKeyDown = (e: React.KeyboardEvent, bulletIndex: number) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addBullet();
        } else if (e.key === "Backspace" && project.bullets[bulletIndex] === "" && project.bullets.length > 1) {
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
                    {/* Name & Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={project.name}
                            onChange={(e) => onUpdate({ ...project, name: e.target.value })}
                            placeholder="Project Name"
                            className="md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-medium placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={project.date_range || ""}
                            onChange={(e) => onUpdate({ ...project, date_range: e.target.value })}
                            placeholder="Date (optional)"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
                        {project.bullets.map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="flex items-start gap-2">
                                <span className="text-gray-500 mt-2.5">•</span>
                                <textarea
                                    value={bullet}
                                    onChange={(e) => updateBullet(bulletIndex, e.target.value)}
                                    onKeyDown={(e) => handleBulletKeyDown(e, bulletIndex)}
                                    placeholder={bulletIndex === 0 ? "Describe your project, technologies used, and impact..." : "Add more details..."}
                                    rows={2}
                                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                                {project.bullets.length > 1 && (
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

export default function ProjectsSection() {
    const { resume, updateSection } = useResume();

    const addProject = () => {
        const newProject: Project = {
            ...createEmptyProject(),
            id: generateId(),
            sort_order: resume.projects.length
        };
        updateSection("projects", [...resume.projects, newProject]);
    };

    const updateProject = (index: number, project: Project) => {
        const newProjects = [...resume.projects];
        newProjects[index] = project;
        updateSection("projects", newProjects);
    };

    const deleteProject = (index: number) => {
        updateSection("projects", resume.projects.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">6</span>
                    Projects
                </h2>
                <button
                    onClick={addProject}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            {resume.projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No projects added yet.</p>
                    <button
                        onClick={addProject}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                        Add your first project
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {resume.projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onUpdate={(updated) => updateProject(index, updated)}
                            onDelete={() => deleteProject(index)}
                        />
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Tip: Include personal, academic, or open-source projects that demonstrate relevant skills.
            </p>
        </div>
    );
}
