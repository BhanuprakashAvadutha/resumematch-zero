// Server Component (default in Next.js App Router)

import { redirect } from "next/navigation";
import { createClient, getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { FileText, Calendar, Trash2, ArrowRight } from "lucide-react";

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

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
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
