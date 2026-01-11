'use client';

import { Trash2, Calendar, Award, FileSearch } from 'lucide-react';
import Link from 'next/link';
import { deleteScan } from '@/app/history/actions';

interface Scan {
    id: string;
    created_at: string;
    result: {
        score: number;
        feedback: string;
    };
}

interface ScanHistoryProps {
    scans: Scan[];
}

export default function ScanHistory({ scans }: ScanHistoryProps) {
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-500';
        if (score < 50) return 'text-red-500'; // Updated logic: < 50 is red
        return 'text-yellow-500';
    };

    if (!scans || scans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                    <FileSearch className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
                <p className="text-gray-400 mb-6 text-center max-w-sm">
                    Let's optimize your first resume. Upload your resume to get instant feedback and scoring.
                </p>
                <Link
                    href="/"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Start New Scan
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => (
                <div
                    key={scan.id}
                    className="group bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {new Date(scan.created_at).toLocaleDateString()}
                            </div>
                            <h3 className="font-medium text-white line-clamp-1" title={scan.result.feedback}>
                                Resume Analysis
                            </h3>
                        </div>
                        <div className={`flex items-center gap-1 font-bold text-lg ${getScoreColor(scan.result.score)}`}>
                            <Award className="w-4 h-4" />
                            {scan.result.score}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-4 mb-6 leading-relaxed flex-grow">
                        {scan.result.feedback}
                    </p>

                    <div className="flex justify-end pt-4 border-t border-white/5 mt-auto">
                        <form action={deleteScan.bind(null, scan.id)}>
                            <button
                                type="submit"
                                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
                                title="Delete Scan"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}
