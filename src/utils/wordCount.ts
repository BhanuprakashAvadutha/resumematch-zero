/**
 * Simple word count utility for summary validation
 */
export function countWords(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Check if summary length is within ideal range (20-50 words)
 */
export function validateSummaryLength(summary: string): {
    isValid: boolean;
    wordCount: number;
    message: string | null;
} {
    const wordCount = countWords(summary);

    if (wordCount === 0) {
        return {
            isValid: false,
            wordCount,
            message: 'Add a professional summary to introduce yourself.'
        };
    }

    if (wordCount < 20) {
        return {
            isValid: false,
            wordCount,
            message: `Your summary is too short (${wordCount} words). Aim for 20-50 words.`
        };
    }

    if (wordCount > 50) {
        return {
            isValid: false,
            wordCount,
            message: `Your summary is too long (${wordCount} words). Shorten it to 20-50 words.`
        };
    }

    return {
        isValid: true,
        wordCount,
        message: null
    };
}
