"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    Resume,
    createEmptyResume
} from "@/types/resume";

// Generate a unique ID
function generateId(): string {
    return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

interface ResumeContextType {
    resume: Resume;
    updateResume: (updates: Partial<Resume>) => void;
    updateSection: <K extends keyof Resume>(section: K, value: Resume[K]) => void;
    isDirty: boolean;
    save: () => void;
    load: (id: string) => void;
    createNew: () => void;
    listSaved: () => { id: string; title: string; updatedAt: string }[];
    deleteResume: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

const STORAGE_KEY = "resumatch_resumes";
const ACTIVE_KEY = "resumatch_active_resume";

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Initialize resume on mount
    useEffect(() => {
        const activeId = localStorage.getItem(ACTIVE_KEY);
        if (activeId) {
            const saved = getSavedResumes();
            const found = saved.find(r => r.id === activeId);
            if (found) {
                setResume(found);
                return;
            }
        }
        // Create new resume if none active
        const newResume = createNewResume();
        setResume(newResume);
        saveResume(newResume);
        localStorage.setItem(ACTIVE_KEY, newResume.id);
    }, []);

    function getSavedResumes(): Resume[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function saveResume(resumeToSave: Resume) {
        const saved = getSavedResumes();
        const existingIndex = saved.findIndex(r => r.id === resumeToSave.id);
        const updated = { ...resumeToSave, updated_at: new Date().toISOString() };

        if (existingIndex >= 0) {
            saved[existingIndex] = updated;
        } else {
            saved.push(updated);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        setResume(updated);
        setIsDirty(false);
    }

    function createNewResume(): Resume {
        const now = new Date().toISOString();
        return {
            ...createEmptyResume("local"),
            id: generateId(),
            user_id: "local",
            created_at: now,
            updated_at: now,
        } as Resume;
    }

    function updateResume(updates: Partial<Resume>) {
        if (!resume) return;
        setResume(prev => prev ? { ...prev, ...updates } : prev);
        setIsDirty(true);
    }

    function updateSection<K extends keyof Resume>(section: K, value: Resume[K]) {
        if (!resume) return;
        setResume(prev => prev ? { ...prev, [section]: value } : prev);
        setIsDirty(true);
    }

    function save() {
        if (resume) {
            saveResume(resume);
        }
    }

    function load(id: string) {
        const saved = getSavedResumes();
        const found = saved.find(r => r.id === id);
        if (found) {
            setResume(found);
            localStorage.setItem(ACTIVE_KEY, id);
            setIsDirty(false);
        }
    }

    function createNew() {
        const newResume = createNewResume();
        saveResume(newResume);
        localStorage.setItem(ACTIVE_KEY, newResume.id);
    }

    function listSaved() {
        return getSavedResumes().map(r => ({
            id: r.id,
            title: r.title || "Untitled Resume",
            updatedAt: r.updated_at
        }));
    }

    function deleteResume(id: string) {
        const saved = getSavedResumes().filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

        // If we deleted the active resume, create a new one
        if (resume?.id === id) {
            if (saved.length > 0) {
                setResume(saved[0]);
                localStorage.setItem(ACTIVE_KEY, saved[0].id);
            } else {
                createNew();
            }
        }
    }

    // Auto-save every 5 seconds if dirty (reduced from 30s to prevent data loss)
    useEffect(() => {
        if (!isDirty || !resume) return;

        const timer = setTimeout(() => {
            saveResume(resume);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isDirty, resume]);

    if (!resume) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <ResumeContext.Provider value={{
            resume,
            updateResume,
            updateSection,
            isDirty,
            save,
            load,
            createNew,
            listSaved,
            deleteResume
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
}
