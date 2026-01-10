import { createClient } from '@/utils/supabase/server';
import { deleteScan } from '@/app/history/actions';
import { redirect } from 'next/navigation';
import { Trash2, Calendar, Award } from 'lucide-react';

export default async function HistoryPage() {
    const supabase = await createClient();

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Fetch Data
    const { data: scans } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Helper for score color (duplicated logic, could be shared util)
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <main className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Scan History</h1>

            {!scans || scans.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/50 border border-white/10 rounded-2xl">
                    <p className="text-gray-500">No scans found yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {scans.map((scan) => (
                        <div
                            key={scan.id}
                            className="group bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
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

                            <p className="text-sm text-gray-400 line-clamp-4 mb-6 h-20 leading-relaxed">
                                {scan.result.feedback}
                            </p>

                            <div className="flex justify-end pt-4 border-t border-white/5">
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
            )}
        </main>
    );
}
