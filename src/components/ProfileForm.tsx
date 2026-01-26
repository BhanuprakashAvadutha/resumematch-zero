"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    linkedin_url: string | null;
    primary_role: string | null;
    experience_level: string | null;
    plan: string;
}

interface ProfileFormProps {
    initialProfile: Profile | null;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: initialProfile?.full_name || "",
        linkedin_url: initialProfile?.linkedin_url || "",
        primary_role: initialProfile?.primary_role || "",
        experience_level: initialProfile?.experience_level || "Student",
    });

    const supabase = createClient();

    const handleSave = async () => {
        if (!profile) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    linkedin_url: formData.linkedin_url,
                    primary_role: formData.primary_role,
                    experience_level: formData.experience_level,
                })
                .eq("id", profile.id);

            if (error) throw error;

            // Update local state
            setProfile({ ...profile, ...formData });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const experienceOptions = [
        "Student",
        "Entry level",
        "1-2 years",
        "2-4 years",
        "4-6 years",
        "6+ years",
    ];

    if (!profile) return <div className="text-red-400">Error loading profile.</div>;

    return (
        <section className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Full Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 md:py-2 text-base md:text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="John Doe"
                        />
                    ) : (
                        <p className="text-lg font-semibold text-white break-words">{profile.full_name || "Not set"}</p>
                    )}
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Email Address</label>
                    <p className="text-lg font-semibold text-gray-300 break-all">{profile.email}</p>
                </div>

                {/* Primary Role */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Primary Role</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.primary_role}
                            onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 md:py-2 text-base md:text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g. Frontend Developer"
                        />
                    ) : (
                        <p className="text-lg font-semibold text-white break-words">{profile.primary_role || "Not set"}</p>
                    )}
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Experience Level</label>
                    {isEditing ? (
                        <select
                            value={formData.experience_level}
                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 md:py-2 text-base md:text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                        >
                            {experienceOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-lg font-semibold text-white">{profile.experience_level || "Not set"}</p>
                    )}
                </div>

                {/* LinkedIn URL - Full Width */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-gray-400 text-sm font-medium">LinkedIn Profile URL</label>
                    {isEditing ? (
                        <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 md:py-2 text-base md:text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="https://linkedin.com/in/username"
                        />
                    ) : (
                        <p className="text-lg font-semibold text-indigo-400 truncate">
                            {profile.linkedin_url ? (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                                    {profile.linkedin_url}
                                </a>
                            ) : (
                                <span className="text-gray-500">Not connected</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
