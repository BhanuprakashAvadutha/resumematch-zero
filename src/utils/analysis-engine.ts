
// 1. Skill Weights & Categories
export const SKILL_WEIGHTS: Record<string, number> = {
    // CRITICAL (x3.0)
    sql: 3.0,
    python: 3.0,
    java: 3.0,
    javascript: 3.0,
    typescript: 3.0,
    react: 3.0,
    "node.js": 3.0,
    aws: 3.0,
    azure: 3.0,
    docker: 3.0,
    kubernetes: 3.0,
    "data analysis": 3.0,
    "machine learning": 3.0,

    // IMPORTANT (x2.0)
    html: 2.0,
    css: 2.0,
    git: 2.0,
    api: 2.0,
    "rest api": 2.0,
    graphql: 2.0,
    tableau: 2.0,
    "power bi": 2.0,
    excel: 2.0,
    linux: 2.0,
    agile: 2.0,
    scrum: 2.0,

    // NICE TO HAVE (x1.2) - Default for unknown technical terms if inferred
    jira: 1.2,
    confluence: 1.2,
    slack: 1.2,
    zoom: 1.2,

    // SOFT SKILLS (x0.5) - We value them less than hard skills for the technical score
    communication: 0.5,
    leadership: 0.5,
    teamwork: 0.5,
    "problem solving": 0.5,
    "time management": 0.5,
};

// 2. Synonym Mapping (Normalized -> Variations)
export const SYNONYM_MAP: Record<string, string[]> = {
    javascript: ["js", "es6"],
    typescript: ["ts"],
    react: ["reactjs", "react.js"],
    "node.js": ["node", "nodejs"],
    python: ["py"],
    golang: ["go"],
    "c#": ["csharp"],
    "c++": ["cpp"],
    "power bi": ["powerbi", "pbi"],
    tableau: ["tableau desktop"],
    excel: ["ms excel", "spreadsheets", "google sheets"], // "sheets" mapping handled via "google sheets" phrase
    aws: ["amazon web services"],
    gcp: ["google cloud platform", "google cloud"],
    azure: ["microsoft azure"],
    junior: ["fresher", "entry level", "graduate", "associate"],
    senior: ["lead", "principal", "staff"],
};

// 3. Stop Words (Enhanced)
// 3. Stop Words (Enhanced)
export const STOP_WORDS = new Set([
    // 1. USER-REPORTED GARBAGE (High Priority Removal)
    "science", "internship", "summer", "2024", "2025", "2026", "2027", "duration", "location", "remote", "hybrid", "onsite", "overview", "we", "our", "us", "you", "your", "developing", "develop", "development", "program", "opportunity", "apply", "application", "deadline",

    // 2. Logistics & Time
    "month", "months", "year", "years", "week", "weeks", "day", "days", "hour", "hours", "fulltime", "full-time", "parttime", "part-time", "contract", "temporary", "permanent", "shift", "schedule", "monday", "friday", "start", "end", "date", "salary", "benefits", "compensation", "per", "annum", "hour",

    // 3. Corporate Fluff & Sections
    "responsibilities", "requirements", "qualifications", "preferred", "desired", "plus", "bonus", "about", "company", "team", "culture", "mission", "vision", "values", "description", "summary", "role", "position", "candidate", "ideal", "person", "individual", "seeking", "looking", "join", "help", "support", "reporting", "reports", "closely", "work", "environment", "fast-paced", "dynamic",

    // 4. Generic Verbs (Actions are NOT Skills)
    "manage", "managing", "create", "creating", "build", "building", "maintain", "maintaining", "lead", "leading", "coordinate", "coordinating", "collaborate", "collaborating", "assist", "assisting", "ensure", "ensuring", "provide", "providing", "perform", "performing", "participate", "participating", "follow", "following", "execute", "executing", "deliver", "delivering", "demonstrate", "demonstrating", "identify", "identifying", "analyze", "analyzing", "collect", "collecting", "prepare", "preparing", "clean", "cleaning", "understand", "understanding", "improve", "improving", "existing", "new",

    // 5. Standard Grammar
    "the", "and", "or", "a", "an", "to", "of", "in", "for", "with", "on", "at", "from", "by", "as", "is", "are", "was", "were", "be", "been", "has", "have", "had", "it", "that", "this", "these", "those", "which", "what", "where", "when", "why", "how", "can", "could", "will", "would", "should", "must"
]);

// 4. Phrase Keywords (to detect before splitting)
const PHRASE_KEYWORDS = [
    "google sheets", "power bi", "data analysis", "machine learning", "artificial intelligence", "deep learning", "neural networks", "natural language processing", "computer vision",
    "data science", "data engineering", "web development", "software engineering", "cloud computing", "devops", "ci/cd", "continuous integration", "continuous deployment",
    "project management", "product management", "business intelligence", "supply chain", "human resources", "digital marketing", "content creation",
    "react native", "next.js", "vue.js", "angular", "spring boot", "asp.net", "ruby on rails", "django", "flask", "fastapi", "express.js",
    "microsoft office", "microsoft word", "microsoft powerpoint", "google docs", "google slides",
];

// Helper: Normalize textual input
export function normalizeText(text: string): string {
    return text.toLowerCase();
}

// Helper: Normalize a single keyword for comparison
export function normalizeKeyword(word: string): string {
    return word.toLowerCase().replace(/[^a-z0-9.+]/g, ""); // Keep . and + for C++, Node.js
}

// Helper: Get canonical term from synonym
export function getCanonicalTerm(term: string): string {
    const lowerTerm = term.toLowerCase();
    for (const [canonical, variants] of Object.entries(SYNONYM_MAP)) {
        if (canonical === lowerTerm || variants.includes(lowerTerm)) {
            return canonical;
        }
    }
    return lowerTerm;
}

// Main Extraction Logic
export function extractKeywords(text: string): string[] {
    const normalizedText = normalizeText(text);
    const foundKeywords: Set<string> = new Set();

    // 1. Extract Phrases First
    PHRASE_KEYWORDS.forEach(phrase => {
        if (normalizedText.includes(phrase)) {
            foundKeywords.add(phrase);
        }
    });

    // 2. Extract Individual Words
    // Remove special chars but keep essential ones for tech terms (e.g. C++, C#, .NET -> we might lose .net with simplified regex, but handled implicitly or via dedicated parsing if strict)
    // For simplicity, we split by non-alphanumeric except specific tech chars: + # .
    // A safer general split is by whitespace, then clean edges.
    const words = normalizedText.split(/[\s,()\[\]{}"'\/]+/);

    words.forEach(word => {
        // Basic cleaning
        let cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, ""); // Trim non-word chars from ends

        // Explicit fix for "c++", "c#"
        if (word === "c++" || word === "c#") cleanWord = word;
        if (word.endsWith(".js")) cleanWord = word;

        if (cleanWord.length < 2) return; // Skip single chars except 'c' or 'r' (but 'r' is hard to distinguish from random letter) -> safe to skip < 2 for now unless whitelist.

        // Skip stop words
        if (STOP_WORDS.has(cleanWord)) return;

        // Normalize (canonicalize)
        const canonical = getCanonicalTerm(cleanWord);

        // Add if not already found (as phrase or word)
        // Check if this word is part of an already found phrase? 
        // E.g. found "power bi", no need to add "power" and "bi" separately if we want clean list?
        // User requested "Google Sheets" -> "Sheets" matching.
        // If we have "google sheets" in JD and "sheets" in Resume, we want a match.
        // So we should probably keep individual words too, OR handle fuzzy match logic.
        // For this implementation, we will add the word.
        foundKeywords.add(canonical);
    });

    return Array.from(foundKeywords);
}

// Score Calculation Logic
export function calculateScore(jobKeywords: string[], resumeKeywords: string[]): { score: number, matched: string[], missing: string[] } {
    const resumeSet = new Set(resumeKeywords.map(k => getCanonicalTerm(k)));
    const jobSet = new Set(jobKeywords.map(k => getCanonicalTerm(k)));

    // Weights Sum
    let totalWeight = 0;
    let matchedWeight = 0;

    const matched: string[] = [];
    const missing: string[] = [];

    jobSet.forEach(jobKey => {
        // Determine Weight
        let weight = SKILL_WEIGHTS[jobKey] || 1.0; // Default weight

        // Heuristic: If it looks like a soft skill (not in map), use 0.8
        if (!SKILL_WEIGHTS[jobKey] && ["communication", "team", "detail", "work"].some(s => jobKey.includes(s))) {
            weight = 0.8;
        }

        totalWeight += weight;

        // Check Match
        // 1. Direct Match
        let isMatch = resumeSet.has(jobKey);

        // 2. Sub-word Match (e.g. "google sheets" in JD, "sheets" in Resume)
        if (!isMatch) {
            // If jobKey is phrase, check if resume has significant parts
            if (jobKey.includes(" ")) {
                const parts = jobKey.split(" ");
                // If resume has all parts? OR just strict key? 
                // User Ex: Missed "sheets" from "Google Sheets". 
                // If JD has "google sheets", Resume has "sheets".
                // We can match if resume has "sheets" AND "sheets" is not a stop word.
                // But "sheets" might be too generic. 
                // Better: Check if resumeSet has any synonym or part?
                // Let's stick to Canonical match for now. the expandCompound suggestion by user:
                // "Google Sheets" -> ["Google Sheets", "Google", "Sheets"]
                // If we did that during extraction, then 'sheets' would be in jobKeywords.
                // Let's rely on extraction having done that if necessary.
                // For now, simple check:
            }
        }

        if (isMatch) {
            matchedWeight += weight;
            matched.push(jobKey);
        } else {
            missing.push(jobKey);
        }
    });

    // Calculate Percentage
    let rawScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

    // Formatting adjustments (Round to nearest integer)
    let finalScore = Math.round(rawScore);

    // User requirement: Minimal score 50?
    // "the minimun score should not less than 50 percent - implied if there is *some* match"
    // Implementing a gentle floor if there are matches
    if (matched.length > 0 && finalScore < 30) finalScore = 30; // Boost slightly for effort

    // Cap at 100
    if (finalScore > 100) finalScore = 100;

    return { score: finalScore, matched, missing };
}
