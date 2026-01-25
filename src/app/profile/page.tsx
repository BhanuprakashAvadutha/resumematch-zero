import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User, CreditCard, BarChart3, LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const { count: scanCount } = await supabase
        .from("scans")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    const fullName = profile?.full_name || user.user_metadata?.full_name || "User";
    const credits = profile?.credits ?? 10;
    const tier = profile?.tier || "Free";

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Identity Card */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl md:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                                {fullName[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{fullName}</h2>
                                <p className="text-gray-400 text-sm">{profile?.email || user.email}</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded uppercase font-bold tracking-wider">
                                    {tier} Plan
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <BarChart3 size={20} />
                            <span className="text-sm font-medium">Total Scans</span>
                        </div>
                        <span className="text-4xl font-bold text-white">{scanCount || 0}</span>
                    </div>
                </div>

                {/* Credits Card */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <CreditCard size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold">Analysis Credits</h3>
                        </div>
                        <span className="text-xl font-bold">{credits} / 10</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(credits / 10) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        You are on the Free Tier. Credits reset monthly.
                    </p>
                </div>

                {/* Logout */}
                <form action={signOut}>
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-bold transition-colors">
                        <LogOut size={20} /> Sign Out
                    </button>
                </form>
            </div>
        </main>
    );
}
