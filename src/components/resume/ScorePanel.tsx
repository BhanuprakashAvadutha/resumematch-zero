"use client";
import { useMemo } from "react";
import { useResume } from "./ResumeContext";
import { scoreResume, getScoreLabel, getScoreColor } from "@/utils/scoreResume";
import { Zap, CheckCircle2, AlertCircle, Lightbulb, ChevronRight } from "lucide-react";

export default function ScorePanel() {
    const { resume } = useResume();

    const score = useMemo(() => scoreResume(resume), [resume]);

    const getTypeIcon = (type: 'important' | 'recommended' | 'nice_to_have') => {
        switch (type) {
            case 'important':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'recommended':
                return <Lightbulb className="w-4 h-4 text-yellow-400" />;
            case 'nice_to_have':
                return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
        }
    };

    const getTypeBg = (type: 'important' | 'recommended' | 'nice_to_have') => {
        switch (type) {
            case 'important':
                return 'bg-red-500/10 border-red-500/20';
            case 'recommended':
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 'nice_to_have':
                return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    const importantHints = score.hints.filter(h => h.type === 'important');
    const recommendedHints = score.hints.filter(h => h.type === 'recommended');
    const niceToHaveHints = score.hints.filter(h => h.type === 'nice_to_have');

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-5">
            {/* Score Display */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-300">Resume Score</h3>
                        <p className="text-xs text-gray-500">Based on best practices</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className={`text-3xl font-bold ${getScoreColor(score.total)}`}>
                        {score.total}
                    </p>
                    <p className="text-xs text-gray-500">{getScoreLabel(score.total)}</p>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Completeness</span>
                    <span className="text-white">{score.completeness}/40</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(score.completeness / 40) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Content Quality</span>
                    <span className="text-white">{score.contentQuality}/40</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(score.contentQuality / 40) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Formatting</span>
                    <span className="text-white">{score.formatting}/20</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(score.formatting / 20) * 100}%` }}
                    />
                </div>
            </div>

            {/* Hints */}
            {score.hints.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gray-800">
                    {/* Important */}
                    {importantHints.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-red-400 uppercase tracking-wide">Important</p>
                            {importantHints.map((hint, i) => (
                                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${getTypeBg(hint.type)}`}>
                                    {getTypeIcon(hint.type)}
                                    <p className="text-sm text-gray-300 flex-1">{hint.message}</p>
                                    {hint.action && (
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recommended */}
                    {recommendedHints.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Recommended</p>
                            {recommendedHints.slice(0, 3).map((hint, i) => (
                                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${getTypeBg(hint.type)}`}>
                                    {getTypeIcon(hint.type)}
                                    <p className="text-sm text-gray-300 flex-1">{hint.message}</p>
                                </div>
                            ))}
                            {recommendedHints.length > 3 && (
                                <p className="text-xs text-gray-500">+{recommendedHints.length - 3} more</p>
                            )}
                        </div>
                    )}

                    {/* Nice to Have */}
                    {niceToHaveHints.length > 0 && importantHints.length === 0 && recommendedHints.length === 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Nice to Have</p>
                            {niceToHaveHints.slice(0, 2).map((hint, i) => (
                                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${getTypeBg(hint.type)}`}>
                                    {getTypeIcon(hint.type)}
                                    <p className="text-sm text-gray-400 flex-1">{hint.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {score.total >= 80 && score.hints.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-300">Your resume looks great!</p>
                </div>
            )}
        </div>
    );
}
