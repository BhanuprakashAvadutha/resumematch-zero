import { Resume, ResumeScore, ScoreHint } from '@/types/resume';
import { countWords } from './wordCount';

/**
 * Action verbs that indicate strong accomplishments
 */
const ACTION_VERBS = new Set([
    'achieved', 'accomplished', 'accelerated', 'acquired', 'activated', 'adapted',
    'administered', 'advanced', 'analyzed', 'applied', 'approved', 'architected',
    'arranged', 'assembled', 'assessed', 'assigned', 'attained', 'audited',
    'automated', 'balanced', 'built', 'calculated', 'captured', 'centralized',
    'championed', 'collaborated', 'communicated', 'completed', 'composed',
    'computed', 'conceptualized', 'conducted', 'consolidated', 'constructed',
    'consulted', 'contributed', 'controlled', 'converted', 'coordinated',
    'created', 'cultivated', 'customized', 'debugged', 'decreased', 'defined',
    'delegated', 'delivered', 'demonstrated', 'deployed', 'designed', 'developed',
    'devised', 'diagnosed', 'directed', 'discovered', 'documented', 'doubled',
    'drafted', 'drove', 'earned', 'edited', 'educated', 'effected', 'eliminated',
    'enabled', 'encouraged', 'engineered', 'enhanced', 'ensured', 'established',
    'evaluated', 'examined', 'exceeded', 'executed', 'expanded', 'expedited',
    'experimented', 'explored', 'facilitated', 'finalized', 'fixed', 'focused',
    'forecasted', 'formulated', 'founded', 'generated', 'grew', 'guided',
    'halved', 'handled', 'headed', 'identified', 'illustrated', 'implemented',
    'improved', 'increased', 'influenced', 'initiated', 'innovated', 'inspected',
    'installed', 'instituted', 'instructed', 'integrated', 'interpreted',
    'introduced', 'invented', 'investigated', 'launched', 'led', 'leveraged',
    'maintained', 'managed', 'manufactured', 'mapped', 'marketed', 'maximized',
    'measured', 'mentored', 'merged', 'minimized', 'modeled', 'modernized',
    'modified', 'monitored', 'motivated', 'negotiated', 'obtained', 'operated',
    'optimized', 'orchestrated', 'organized', 'originated', 'outperformed',
    'oversaw', 'partnered', 'performed', 'pioneered', 'planned', 'prepared',
    'presented', 'prioritized', 'processed', 'produced', 'programmed', 'projected',
    'promoted', 'proposed', 'prototyped', 'provided', 'published', 'purchased',
    'quadrupled', 'qualified', 'quantified', 'raised', 'ranked', 'reached',
    'realized', 'rebuilt', 'received', 'recognized', 'recommended', 'reconciled',
    'recorded', 'recruited', 'redesigned', 'reduced', 'refined', 'reformed',
    'registered', 'regulated', 'rehabilitated', 'remodeled', 'reorganized',
    'repaired', 'replaced', 'reported', 'represented', 'researched', 'resolved',
    'restored', 'restructured', 'retrieved', 'reviewed', 'revised', 'revitalized',
    'saved', 'scheduled', 'secured', 'selected', 'served', 'shaped', 'simplified',
    'solved', 'spearheaded', 'specialized', 'specified', 'standardized', 'started',
    'streamlined', 'strengthened', 'structured', 'studied', 'succeeded', 'suggested',
    'summarized', 'supervised', 'supplied', 'supported', 'surpassed', 'surveyed',
    'sustained', 'synchronized', 'synthesized', 'systematized', 'targeted', 'taught',
    'tested', 'tracked', 'trained', 'transferred', 'transformed', 'translated',
    'tripled', 'troubleshot', 'uncovered', 'unified', 'updated', 'upgraded',
    'utilized', 'validated', 'verified', 'visualized', 'won', 'wrote'
]);

/**
 * Check if text contains metrics/numbers
 */
function hasMetrics(text: string): boolean {
    // Match percentages, dollar amounts, numbers with context
    return /\d+%|\$[\d,]+|\d+[kmb]|\d+\s*(users|clients|customers|projects|hours|days|weeks|months|years|team|members|people)/i.test(text);
}

/**
 * Check if text starts with an action verb
 */
function startsWithActionVerb(text: string): boolean {
    const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return ACTION_VERBS.has(firstWord);
}

/**
 * Score completeness (out of 40 points)
 */
function scoreCompleteness(resume: Resume): { score: number; hints: ScoreHint[] } {
    let score = 0;
    const hints: ScoreHint[] = [];

    // Summary (8 points)
    const summaryWords = countWords(resume.summary || '');
    if (summaryWords >= 20 && summaryWords <= 50) {
        score += 8;
    } else if (summaryWords > 0) {
        score += 4;
        hints.push({
            type: 'important',
            message: `Summary should be 20-50 words (currently ${summaryWords})`,
            section: 'summary',
            action: 'Edit summary'
        });
    } else {
        hints.push({
            type: 'important',
            message: 'Add a professional summary',
            section: 'summary',
            action: 'Add summary'
        });
    }

    // Work Experience (12 points)
    if (resume.experiences && resume.experiences.length > 0) {
        score += 6;
        const expWithBullets = resume.experiences.filter(e => e.bullets && e.bullets.length >= 2);
        if (expWithBullets.length === resume.experiences.length) {
            score += 6;
        } else {
            hints.push({
                type: 'recommended',
                message: 'Add at least 2 bullet points per experience',
                section: 'experience',
                action: 'Add bullet points'
            });
        }
    } else {
        hints.push({
            type: 'important',
            message: 'Add work experience',
            section: 'experience',
            action: 'Add experience'
        });
    }

    // Skills (8 points)
    if (resume.skills && resume.skills.length > 0) {
        const totalSkills = resume.skills.reduce((sum, cat) => sum + cat.items.length, 0);
        if (totalSkills >= 5) {
            score += 8;
        } else {
            score += 4;
            hints.push({
                type: 'recommended',
                message: 'Add more skills (aim for at least 5)',
                section: 'skills',
                action: 'Add skills'
            });
        }
    } else {
        hints.push({
            type: 'important',
            message: 'Add a skills section',
            section: 'skills',
            action: 'Add skills'
        });
    }

    // Education (6 points)
    if (resume.education && resume.education.length > 0) {
        score += 6;
    } else {
        hints.push({
            type: 'recommended',
            message: 'Add education information',
            section: 'education',
            action: 'Add education'
        });
    }

    // Contact info (6 points)
    let contactScore = 0;
    if (resume.email) contactScore += 2;
    else hints.push({ type: 'important', message: 'Add email address', section: 'header' });

    if (resume.phone) contactScore += 2;
    else hints.push({ type: 'recommended', message: 'Add phone number', section: 'header' });

    if (resume.links && resume.links.length > 0) contactScore += 2;
    else hints.push({ type: 'nice_to_have', message: 'Add LinkedIn or portfolio link', section: 'header' });

    score += contactScore;

    return { score, hints };
}

/**
 * Score content quality (out of 40 points)
 */
function scoreContentQuality(resume: Resume): { score: number; hints: ScoreHint[] } {
    let score = 0;
    const hints: ScoreHint[] = [];

    // Collect all bullets
    const allBullets: string[] = [];

    if (resume.experiences) {
        for (const exp of resume.experiences) {
            allBullets.push(...(exp.bullets || []));
        }
    }

    if (resume.projects) {
        for (const proj of resume.projects) {
            allBullets.push(...(proj.bullets || []));
        }
    }

    if (allBullets.length === 0) {
        return { score: 0, hints };
    }

    // Check for action verbs (15 points)
    const bulletsWithActionVerbs = allBullets.filter(b => startsWithActionVerb(b));
    const actionVerbRatio = bulletsWithActionVerbs.length / allBullets.length;

    if (actionVerbRatio >= 0.8) {
        score += 15;
    } else if (actionVerbRatio >= 0.5) {
        score += 10;
        hints.push({
            type: 'recommended',
            message: 'Start more bullet points with strong action verbs',
            section: 'experience'
        });
    } else {
        score += 5;
        hints.push({
            type: 'important',
            message: 'Use action verbs like "Led", "Built", "Increased" to start bullet points',
            section: 'experience'
        });
    }

    // Check for metrics/numbers (15 points)
    const bulletsWithMetrics = allBullets.filter(b => hasMetrics(b));
    const metricsRatio = bulletsWithMetrics.length / allBullets.length;

    if (metricsRatio >= 0.3) {
        score += 15;
    } else if (metricsRatio >= 0.15) {
        score += 10;
        hints.push({
            type: 'recommended',
            message: 'Add more quantifiable achievements (numbers, percentages)',
            section: 'experience'
        });
    } else {
        score += 5;
        hints.push({
            type: 'important',
            message: 'Quantify your impact with numbers (e.g., "Increased sales by 30%")',
            section: 'experience'
        });
    }

    // Bullet point count per experience (10 points)
    if (resume.experiences && resume.experiences.length > 0) {
        const avgBullets = allBullets.length / resume.experiences.length;
        if (avgBullets >= 3 && avgBullets <= 6) {
            score += 10;
        } else if (avgBullets >= 2) {
            score += 6;
            hints.push({
                type: 'nice_to_have',
                message: 'Aim for 3-6 bullet points per experience',
                section: 'experience'
            });
        } else {
            score += 2;
            hints.push({
                type: 'recommended',
                message: 'Add more bullet points to describe your accomplishments',
                section: 'experience'
            });
        }
    }

    return { score, hints };
}

/**
 * Score formatting and length (out of 20 points)
 */
function scoreFormatting(resume: Resume): { score: number; hints: ScoreHint[] } {
    let score = 0;
    const hints: ScoreHint[] = [];

    // Calculate total word count
    let totalWords = 0;
    totalWords += countWords(resume.summary || '');
    totalWords += countWords(resume.full_name || '');

    if (resume.experiences) {
        for (const exp of resume.experiences) {
            totalWords += countWords(exp.title);
            totalWords += countWords(exp.company);
            for (const bullet of exp.bullets || []) {
                totalWords += countWords(bullet);
            }
        }
    }

    if (resume.education) {
        for (const edu of resume.education) {
            totalWords += countWords(edu.degree);
            totalWords += countWords(edu.institution);
        }
    }

    if (resume.skills) {
        for (const skill of resume.skills) {
            totalWords += skill.items.length; // Count skill items as words
        }
    }

    // Word count scoring (10 points)
    if (totalWords >= 350 && totalWords <= 800) {
        score += 10;
    } else if (totalWords >= 200 && totalWords <= 1000) {
        score += 6;
        if (totalWords < 350) {
            hints.push({
                type: 'recommended',
                message: `Resume is short (${totalWords} words). Aim for 350-800 words.`,
                section: 'general'
            });
        } else {
            hints.push({
                type: 'recommended',
                message: `Resume is long (${totalWords} words). Consider trimming to 350-800 words.`,
                section: 'general'
            });
        }
    } else {
        score += 2;
        hints.push({
            type: 'important',
            message: totalWords < 200
                ? 'Resume needs more content'
                : 'Resume is too long. Focus on most relevant experience.',
            section: 'general'
        });
    }

    // Name present (5 points)
    if (resume.full_name && resume.full_name.trim().length > 0) {
        score += 5;
    } else {
        hints.push({
            type: 'important',
            message: 'Add your full name',
            section: 'header'
        });
    }

    // Location present (5 points)
    if (resume.location && resume.location.trim().length > 0) {
        score += 5;
    } else {
        hints.push({
            type: 'nice_to_have',
            message: 'Add your location (city, state)',
            section: 'header'
        });
    }

    return { score, hints };
}

/**
 * Calculate overall resume score
 */
export function scoreResume(resume: Resume): ResumeScore {
    const completeness = scoreCompleteness(resume);
    const contentQuality = scoreContentQuality(resume);
    const formatting = scoreFormatting(resume);

    const total = completeness.score + contentQuality.score + formatting.score;

    // Combine and deduplicate hints
    const allHints = [...completeness.hints, ...contentQuality.hints, ...formatting.hints];

    // Sort by importance
    const sortedHints = allHints.sort((a, b) => {
        const order = { important: 0, recommended: 1, nice_to_have: 2 };
        return order[a.type] - order[b.type];
    });

    return {
        total,
        completeness: completeness.score,
        contentQuality: contentQuality.score,
        formatting: formatting.score,
        hints: sortedHints
    };
}

/**
 * Get a text description for the score
 */
export function getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Needs Work';
}

/**
 * Get color class for score display
 */
export function getScoreColor(score: number): string {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
}
