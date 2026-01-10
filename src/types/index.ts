/**
 * ResuMatch Zero - Type Definitions
 */

/**
 * Represents a stored scan result from the database
 */
export interface ScanResult {
    id: string;
    user_id: string;
    created_at: string;
    job_title: string;
    match_score: number;
    missing_keywords: string[];
    matched_keywords: string[];
    feedback: string;
}

/**
 * The shape of data returned by the Gemini AI analysis
 */
export interface AnalysisResponse {
    score: number;
    missing_keywords: string[];
    matched_keywords: string[];
    rewritten_bullets: RewrittenBullet[];
    feedback: string;
}

/**
 * A single bullet point rewrite suggestion
 */
export interface RewrittenBullet {
    original: string;
    new: string;
}

/**
 * User session data from Supabase Auth
 */
export interface UserProfile {
    id: string;
    email: string;
    created_at: string;
}

/**
 * Props for components that require authentication
 */
export interface AuthenticatedProps {
    userId: string;
}
