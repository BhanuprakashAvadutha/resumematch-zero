import { AvoidedWordMatch } from '@/types/resume';

/**
 * Dictionary of weak words to avoid in resumes
 * These are overused, vague, or passive phrases that weaken impact
 */
const AVOIDED_WORDS: string[] = [
    // Passive/weak phrases
    'responsible for',
    'duties included',
    'helped',
    'assisted',
    'worked on',
    'was involved in',
    'participated in',
    'contributed to',

    // Overused buzzwords
    'hardworking',
    'team player',
    'self-motivated',
    'detail-oriented',
    'results-driven',
    'go-getter',
    'think outside the box',
    'synergy',
    'leverage',
    'proactive',

    // Vague terms
    'various',
    'numerous',
    'multiple',
    'several',
    'many',
    'etc.',
    'and so on',
    'things',
    'stuff',

    // Weak qualifiers
    'very',
    'really',
    'basically',
    'actually',
    'just',

    // Red flags
    'references available',
    'salary negotiable',
    'objective:',
];

/**
 * Normalize text for matching (lowercase, trim)
 */
function normalizeText(text: string): string {
    return text.toLowerCase().trim();
}

/**
 * Get surrounding context for a match
 */
function getContext(text: string, matchStart: number, matchEnd: number, contextLength: number = 40): string {
    const start = Math.max(0, matchStart - contextLength);
    const end = Math.min(text.length, matchEnd + contextLength);

    let context = text.substring(start, end);
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';

    return context;
}

/**
 * Detect avoided words in a piece of text
 */
function detectInText(
    text: string,
    location: 'summary' | 'experience' | 'project',
    sectionId?: string,
    bulletIndex?: number
): AvoidedWordMatch[] {
    if (!text) return [];

    const matches: AvoidedWordMatch[] = [];
    const normalizedText = normalizeText(text);

    for (const word of AVOIDED_WORDS) {
        const normalizedWord = normalizeText(word);
        let searchStart = 0;

        while (true) {
            const index = normalizedText.indexOf(normalizedWord, searchStart);
            if (index === -1) break;

            // Verify word boundaries (not part of a larger word)
            const charBefore = index > 0 ? normalizedText[index - 1] : ' ';
            const charAfter = index + normalizedWord.length < normalizedText.length
                ? normalizedText[index + normalizedWord.length]
                : ' ';

            const isWordBoundary = /\s|[.,!?;:'"()-]/.test(charBefore) &&
                /\s|[.,!?;:'"()-]/.test(charAfter);

            if (isWordBoundary || normalizedWord.includes(' ')) {
                matches.push({
                    word,
                    location,
                    context: getContext(text, index, index + normalizedWord.length),
                    sectionId,
                    bulletIndex
                });
            }

            searchStart = index + 1;
        }
    }

    return matches;
}

/**
 * Detect avoided words across the entire resume
 */
export function detectAvoidedWords(resume: {
    summary?: string;
    experiences?: Array<{ id: string; bullets: string[] }>;
    projects?: Array<{ id: string; bullets: string[] }>;
}): AvoidedWordMatch[] {
    const allMatches: AvoidedWordMatch[] = [];

    // Check summary
    if (resume.summary) {
        allMatches.push(...detectInText(resume.summary, 'summary'));
    }

    // Check experience bullets
    if (resume.experiences) {
        for (const exp of resume.experiences) {
            for (let i = 0; i < exp.bullets.length; i++) {
                allMatches.push(...detectInText(exp.bullets[i], 'experience', exp.id, i));
            }
        }
    }

    // Check project bullets
    if (resume.projects) {
        for (const proj of resume.projects) {
            for (let i = 0; i < proj.bullets.length; i++) {
                allMatches.push(...detectInText(proj.bullets[i], 'project', proj.id, i));
            }
        }
    }

    // Remove duplicates (same word in same location)
    const uniqueMatches: AvoidedWordMatch[] = [];
    const seen = new Set<string>();

    for (const match of allMatches) {
        const key = `${match.word}-${match.location}-${match.sectionId || ''}-${match.bulletIndex ?? ''}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueMatches.push(match);
        }
    }

    return uniqueMatches;
}

/**
 * Get suggestions for replacing avoided words
 */
export function getReplacementSuggestions(word: string): string[] {
    const suggestions: Record<string, string[]> = {
        'responsible for': ['Managed', 'Led', 'Oversaw', 'Spearheaded'],
        'helped': ['Supported', 'Enabled', 'Facilitated', 'Collaborated with'],
        'assisted': ['Supported', 'Partnered with', 'Contributed to'],
        'worked on': ['Developed', 'Executed', 'Delivered', 'Implemented'],
        'was involved in': ['Contributed to', 'Participated in', 'Drove'],
        'participated in': ['Contributed to', 'Engaged in', 'Took part in'],
        'hardworking': ['Dedicated', 'Committed', '(Show through achievements instead)'],
        'team player': ['Collaborative', '(Demonstrate with examples)'],
        'detail-oriented': ['Meticulous', 'Thorough', '(Show through results)'],
        'various': ['Specific number/names instead'],
        'numerous': ['Specific number instead'],
        'multiple': ['Several', 'Three', 'Five', 'Specific count'],
    };

    return suggestions[word.toLowerCase()] || ['(Rewrite with action verbs and specific details)'];
}

/**
 * Get the list of avoided words (for reference)
 */
export function getAvoidedWordsList(): string[] {
    return [...AVOIDED_WORDS];
}
