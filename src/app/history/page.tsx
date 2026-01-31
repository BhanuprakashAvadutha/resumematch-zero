// Server Component (default in Next.js App Router)

import { redirect } from "next/navigation";
import { createClient, getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { FileText, Calendar, Trash2, BarChart3, Target } from "lucide-react";

export default async function HistoryPage() {
    const { user } = await getUser();

    if (!user) {
        redirect("/login?next=/history");
    }

    const supabase = await createClient();
    const { data: scans, error } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching scans:", error);
    }

    // Calculate dashboard stats
    const totalScans = scans?.length || 0;
    const averageScore = totalScans > 0
        ? Math.round(scans!.reduce((sum: number, scan: any) => sum + (scan.match_score || 0), 0) / totalScans)
        : 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        if (score >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
        return "text-red-400 bg-red-500/10 border-red-500/20";
    };

    const getAverageScoreColor = (score: number) => {
        if (score >= 80) return "from-emerald-500 to-emerald-600";
        if (score >= 50) return "from-amber-500 to-amber-600";
        return "from-red-500 to-red-600";
    };

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
                        <p className="text-gray-400 mt-1">View your past resume analyses.</p>
                    </div>
                    <Link
                        href="/scanner"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                    >
                        New Scan
                    </Link>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {/* Total Scans Card */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <BarChart3 size={28} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Scans</p>
                                <p className="text-4xl font-bold text-white">{totalScans}</p>
                            </div>
                        </div>
                    </div>

                    {/* Average ATS Score Card */}
                    <div className={`bg-gradient-to-br ${totalScans > 0 ? getAverageScoreColor(averageScore).replace('from-', 'from-').replace('to-', 'to-') + '/20' : 'from-gray-600/20 to-gray-800/20'} border ${totalScans > 0 ? 'border-' + (averageScore >= 80 ? 'emerald' : averageScore >= 50 ? 'amber' : 'red') + '-500/20' : 'border-gray-500/20'} rounded-2xl p-6`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 ${totalScans > 0 ? (averageScore >= 80 ? 'bg-emerald-500/20' : averageScore >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20') : 'bg-gray-500/20'} rounded-xl flex items-center justify-center`}>
                                <Target size={28} className={totalScans > 0 ? (averageScore >= 80 ? 'text-emerald-400' : averageScore >= 50 ? 'text-amber-400' : 'text-red-400') : 'text-gray-400'} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Average ATS Score</p>
                                <p className="text-4xl font-bold text-white">
                                    {totalScans > 0 ? `${averageScore}%` : '--'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <h2 className="text-xl font-bold mb-4 text-gray-200">Recent Scans</h2>

                {!scans || scans.length === 0 ? (
                    <div className="text-center py-24 bg-gray-900/50 border border-gray-800 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300">No scans found</h3>
                        <p className="text-gray-500 mt-1 mb-6">You haven't analyzed any resumes yet.</p>
                        <Link href="/scanner" className="text-blue-400 hover:text-blue-300 hover:underline">
                            Start your first scan &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {scans.map((scan: any) => (
                            <div
                                key={scan.id}
                                className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:bg-gray-800/50 flex flex-col sm:flex-row items-center gap-6"
                            >
                                {/* Score Badge */}
                                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${getScoreColor(scan.match_score)} shrink-0`}>
                                    <span className="text-xl font-bold">{scan.match_score}%</span>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 text-center sm:text-left overflow-hidden w-full">
                                    <h3 className="text-lg font-bold text-gray-200 truncate flex items-center justify-center sm:justify-start gap-2">
                                        <FileText size={16} className="text-gray-500" />
                                        {scan.resume_filename || "Untitled Resume"}
                                    </h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-1 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {formatDate(scan.created_at)}
                                        </div>
                                        {/* Snippet of JD if available */}
                                        {scan.job_description_snippet && (
                                            <span className="truncate max-w-[200px] hidden sm:inline-block opacity-60">
                                                • {scan.job_description_snippet.replace(/\n/g, " ").substring(0, 30)}...
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Future: Add View Details Link */}
                                    <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Scan">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
