import { JDMatchResult } from '@/types/resume';

/**
 * Common English stop words to filter out
 */
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', 'you', 'your', 'we', 'our', 'they', 'their', 'he',
    'she', 'him', 'her', 'this', 'that', 'these', 'those', 'what', 'which',
    'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
    'also', 'now', 'here', 'there', 'then', 'once', 'if', 'about', 'above',
    'after', 'again', 'against', 'any', 'because', 'before', 'being', 'below',
    'between', 'during', 'into', 'out', 'over', 'through', 'under', 'until',
    'up', 'while', 'am', 'etc', 'via', 'ie', 'eg', 'per',
    // Common resume filler words
    'ability', 'able', 'experience', 'work', 'working', 'job', 'position',
    'company', 'team', 'role', 'responsibilities', 'duties', 'including',
    'using', 'used', 'utilize', 'utilizing', 'well', 'good', 'great',
    'strong', 'excellent', 'exceptional', 'proven', 'successful'
]);

/**
 * Tokenize text into words, normalizing and filtering
 */
function tokenize(text: string): string[] {
    if (!text) return [];

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s#.+-]/g, ' ')  // Keep #, ., +, - for tech terms (C#, .NET, C++)
        .split(/\s+/)
        .filter(word => word.length >= 3)
        .filter(word => !STOP_WORDS.has(word))
        .filter(word => !/^\d+$/.test(word)); // Remove pure numbers
}

/**
 * Extract keywords with frequency count
 */
function extractKeywordsWithFrequency(text: string): Map<string, number> {
    const keywords = tokenize(text);
    const frequencyMap = new Map<string, number>();

    for (const keyword of keywords) {
        frequencyMap.set(keyword, (frequencyMap.get(keyword) || 0) + 1);
    }

    return frequencyMap;
}

/**
 * Get all text content from resume for keyword extraction
 */
function getResumeText(resume: {
    summary?: string;
    skills?: Array<{ items: string[] }>;
    experiences?: Array<{ title: string; bullets: string[] }>;
    projects?: Array<{ name: string; bullets: string[] }>;
}): string {
    const parts: string[] = [];

    if (resume.summary) parts.push(resume.summary);

    if (resume.skills) {
        for (const skill of resume.skills) {
            parts.push(skill.items.join(' '));
        }
    }

    if (resume.experiences) {
        for (const exp of resume.experiences) {
            parts.push(exp.title);
            parts.push(exp.bullets.join(' '));
        }
    }

    if (resume.projects) {
        for (const proj of resume.projects) {
            parts.push(proj.name);
            parts.push(proj.bullets.join(' '));
        }
    }

    return parts.join(' ');
}

/**
 * Match resume against job description
 */
export function matchResumeWithJD(
    resume: {
        summary?: string;
        skills?: Array<{ items: string[] }>;
        experiences?: Array<{ title: string; bullets: string[] }>;
        projects?: Array<{ name: string; bullets: string[] }>;
    },
    jobDescription: string
): JDMatchResult {
    // Extract keywords from JD
    const jdKeywords = extractKeywordsWithFrequency(jobDescription);

    // Extract keywords from resume
    const resumeText = getResumeText(resume);
    const resumeKeywords = new Set(tokenize(resumeText));

    // Also include exact skill items (case-insensitive)
    if (resume.skills) {
        for (const category of resume.skills) {
            for (const item of category.items) {
                resumeKeywords.add(item.toLowerCase().trim());
            }
        }
    }

    // Find matched and missing keywords
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    // Sort JD keywords by frequency (most important first)
    const sortedJdKeywords = Array.from(jdKeywords.entries())
        .sort((a, b) => b[1] - a[1]);

    for (const [keyword, frequency] of sortedJdKeywords) {
        if (resumeKeywords.has(keyword)) {
            matchedKeywords.push(keyword);
        } else {
            // Only include missing keywords that appear multiple times or are tech terms
            if (frequency >= 2 || /^[a-z]+\+*#?$/.test(keyword)) {
                missingKeywords.push(keyword);
            }
        }
    }

    // Calculate match score
    const totalJdKeywords = sortedJdKeywords.length;
    const matchScore = totalJdKeywords > 0
        ? Math.round((matchedKeywords.length / totalJdKeywords) * 100)
        : 0;

    // Generate suggestions based on missing keywords
    const suggestions: string[] = [];

    if (missingKeywords.length > 0) {
        const topMissing = missingKeywords.slice(0, 5);
        suggestions.push(`Consider adding these keywords if relevant: ${topMissing.join(', ')}`);
    }

    if (matchScore < 50) {
        suggestions.push('Your resume may need significant updates to match this job description.');
    } else if (matchScore < 75) {
        suggestions.push('Good foundation! Adding a few more relevant keywords could improve your match.');
    }

    return {
        matchScore,
        matchedKeywords: matchedKeywords.slice(0, 30), // Limit to top 30
        missingKeywords: missingKeywords.slice(0, 20), // Limit to top 20
        suggestions
    };
}

/**
 * Quick keyword extraction from text (for display purposes)
 */
export function extractKeywords(text: string, limit: number = 20): string[] {
    const keywords = extractKeywordsWithFrequency(text);
    return Array.from(keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([keyword]) => keyword);
}
