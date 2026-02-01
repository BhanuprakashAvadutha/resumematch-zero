"use client";
import { useResume } from "../ResumeContext";
import { Plus, Trash2 } from "lucide-react";

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "email" | "tel" | "url";
}

function InputField({ label, value, onChange, placeholder, type = "text" }: InputFieldProps) {
    return (
        <div className="space-y-1">
            <label className="block text-xs text-gray-400 uppercase tracking-wide">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
        </div>
    );
}

export default function HeaderSection() {
    const { resume, updateResume } = useResume();

    const updateLink = (index: number, field: "label" | "url", value: string) => {
        const newLinks = [...resume.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        updateResume({ links: newLinks });
    };

    const addLink = () => {
        updateResume({ links: [...resume.links, { label: "", url: "" }] });
    };

    const removeLink = (index: number) => {
        updateResume({ links: resume.links.filter((_, i) => i !== index) });
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">1</span>
                Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Full Name"
                    value={resume.full_name}
                    onChange={(value) => updateResume({ full_name: value })}
                    placeholder="John Doe"
                />
                <InputField
                    label="Email"
                    type="email"
                    value={resume.email}
                    onChange={(value) => updateResume({ email: value })}
                    placeholder="john@example.com"
                />
                <InputField
                    label="Phone"
                    type="tel"
                    value={resume.phone}
                    onChange={(value) => updateResume({ phone: value })}
                    placeholder="+1 (555) 123-4567"
                />
                <InputField
                    label="Location"
                    value={resume.location}
                    onChange={(value) => updateResume({ location: value })}
                    placeholder="San Francisco, CA"
                />
            </div>

            {/* Links */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-300">Links (LinkedIn, GitHub, Portfolio)</label>
                    <button
                        onClick={addLink}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                        Add Link
                    </button>
                </div>

                {resume.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateLink(index, "label", e.target.value)}
                                placeholder="Label (e.g., LinkedIn)"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                placeholder="https://..."
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => removeLink(index)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
