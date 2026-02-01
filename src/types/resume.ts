// =============================================================
// Resume Types - Complete TypeScript interfaces for resume data
// =============================================================

/**
 * Link object for resume header (LinkedIn, GitHub, Portfolio, etc.)
 */
export interface ResumeLink {
    label: string;
    url: string;
}

/**
 * Skill category with grouped items
 */
export interface SkillCategory {
    id: string;
    category: string; // e.g., "Technical Skills", "Languages"
    items: string[];  // Individual skills
    sort_order: number;
}

/**
 * Work experience entry
 */
export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    start_date: string;   // e.g., "Jan 2023"
    end_date: string;     // e.g., "Present" or "Dec 2024"
    bullets: string[];
    sort_order: number;
}

/**
 * Education entry
 */
export interface Education {
    id: string;
    degree: string;
    institution: string;
    location?: string;
    start_date?: string;  // e.g., "2024-01" for MonthPicker
    end_date?: string;    // e.g., "2024-12" or "Present"
    date_range: string;   // e.g., "2019 - 2023" (backwards compat)
    gpa?: string;
    notes?: string;       // Honors, distinctions
    sort_order: number;
}

/**
 * Project entry
 */
export interface Project {
    id: string;
    name: string;
    date_range?: string;
    bullets: string[];
    sort_order: number;
}

/**
 * Certification entry
 */
export interface Certification {
    id: string;
    name: string;
    issuer?: string;
    date?: string;
    sort_order: number;
}

/**
 * Award entry
 */
export interface Award {
    id: string;
    title: string;
    issuer?: string;
    date?: string;
    description?: string;
    sort_order: number;
}

/**
 * Complete resume object
 */
export interface Resume {
    id: string;
    user_id: string;
    title: string;

    // Header section
    full_name: string;
    email: string;
    phone: string;
    location: string;
    links: ResumeLink[];

    // Summary section
    summary: string;

    // Structured sections
    skills: SkillCategory[];
    experiences: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    awards: Award[];

    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Resume creation payload (what we send to API)
 */
export type ResumeCreatePayload = Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

/**
 * Resume update payload (partial updates allowed)
 */
export type ResumeUpdatePayload = Partial<ResumeCreatePayload>;

// =============================================================
// Intelligence Feature Types
// =============================================================

/**
 * Resume score breakdown
 */
export interface ResumeScore {
    total: number;             // 0-100
    completeness: number;      // 0-40
    contentQuality: number;    // 0-40
    formatting: number;        // 0-20
    hints: ScoreHint[];
}

/**
 * Individual scoring hint
 */
export interface ScoreHint {
    type: 'important' | 'recommended' | 'nice_to_have';
    message: string;
    section?: string;          // Which section this relates to
    action?: string;           // Suggested action
}

/**
 * Avoided word detection result
 */
export interface AvoidedWordMatch {
    word: string;
    location: 'summary' | 'experience' | 'project';
    context: string;           // Surrounding text for context
    sectionId?: string;        // ID of the experience/project
    bulletIndex?: number;      // Index of the bullet if applicable
}

/**
 * JD matching result
 */
export interface JDMatchResult {
    matchScore: number;        // 0-100
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];     // Recommended additions
}

// =============================================================
// Editor State Types
// =============================================================

/**
 * Editor mode for each section
 */
export type EditorMode = 'view' | 'edit';

/**
 * Active section being edited
 */
export type ActiveSection =
    | 'header'
    | 'summary'
    | 'skills'
    | 'experience'
    | 'education'
    | 'projects'
    | 'certifications'
    | 'awards'
    | null;

/**
 * Editor context state
 */
export interface EditorState {
    resume: Resume;
    activeSection: ActiveSection;
    isDirty: boolean;          // Has unsaved changes
    isSaving: boolean;
    lastSaved: string | null;
}

// =============================================================
// Factory Functions for Creating Empty Objects
// =============================================================

export const createEmptyResume = (userId: string): Omit<Resume, 'id' | 'created_at' | 'updated_at'> => ({
    user_id: userId,
    title: 'Untitled Resume',
    full_name: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    projects: [],
    certifications: [],
    awards: [],
});

export const createEmptyExperience = (): Omit<Experience, 'id'> => ({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: 'Present',
    bullets: [''],
    sort_order: 0,
});

export const createEmptyEducation = (): Omit<Education, 'id'> => ({
    degree: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    date_range: '',
    gpa: '',
    notes: '',
    sort_order: 0,
});

export const createEmptyProject = (): Omit<Project, 'id'> => ({
    name: '',
    date_range: '',
    bullets: [''],
    sort_order: 0,
});

export const createEmptySkillCategory = (): Omit<SkillCategory, 'id'> => ({
    category: '',
    items: [],
    sort_order: 0,
});

export const createEmptyCertification = (): Omit<Certification, 'id'> => ({
    name: '',
    issuer: '',
    date: '',
    sort_order: 0,
});

export const createEmptyAward = (): Omit<Award, 'id'> => ({
    title: '',
    issuer: '',
    date: '',
    description: '',
    sort_order: 0,
});
