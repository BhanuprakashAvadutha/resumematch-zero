import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ScanHistory from '@/components/ScanHistory';
import { BarChart3, Star, FileText } from 'lucide-react';

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

    const recentScans = scans || [];

    // Calculate Stats
    const totalScans = recentScans.length;

    const avgScore = totalScans > 0
        ? Math.round(recentScans.reduce((acc: number, scan: any) => acc + (scan.result.score || 0), 0) / totalScans)
        : 0;

    const highScore = totalScans > 0
        ? Math.max(...recentScans.map((scan: any) => scan.result.score || 0))
        : 0;

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Scans</p>
                            <p className="text-2xl font-bold text-white">{totalScans}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Average Score</p>
                            <p className="text-2xl font-bold text-white">{avgScore}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-lg">
                            <Star className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Highest Score</p>
                            <p className="text-2xl font-bold text-white">{highScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">Your Documents</h2>
            <ScanHistory scans={recentScans} />
        </main>
    );
}
