"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Redirect unauthenticated users to login, preserving intended destination
        redirect("/login?next=/profile");
    }

    // Fetch user profile details
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name,email,plan")
        .eq("id", user.id)
        .single();

    // Fetch total scans count for this user
    const { count: scansCount } = await supabase
        .from("scans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

    const initials = profile?.full_name
        ? profile.full_name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
        : "U";

    const badge = profile?.plan === "pro" ? { label: "Pro", color: "bg-yellow-400" } : { label: "Free Tier", color: "bg-gray-500" };

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <h1 className="text-4xl font-bold text-center">My Account</h1>

                {/* Card 1 – Identity */}
                <section className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center sm:text-left">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <p className="text-xl font-semibold">{profile?.full_name || "Unnamed User"}</p>
                        <p className="text-gray-400 break-all">{profile?.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} text-black mt-2 sm:mt-0`}>
                        {badge.label}
                    </span>
                </section>

                {/* Card 2 – Usage */}
                <section className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Usage</h2>
                    <p className="text-3xl font-mono mb-2">Total Scans Run: {scansCount ?? 0}</p>
                    {/* Placeholder progress bar for credits used – assuming 100 credits max */}
                    <div className="w-full bg-gray-800 rounded-full h-4">
                        <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${Math.min((scansCount ?? 0) * 10, 100)}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Credits Used</p>
                </section>

                {/* Card 3 – Actions */}
                <section className="flex flex-col sm:flex-row gap-4 justify-center">
                    <form action={async () => {
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                        redirect("/login");
                    }} className="w-full sm:w-auto">
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium">
                            Sign Out
                        </button>
                    </form>
                    <button
                        onClick={() => alert("Password update flow not implemented yet.")}
                        className="w-full sm:w-auto px-6 py-2 border border-indigo-400 hover:bg-indigo-900 rounded-lg font-medium"
                    >
                        Update Password
                    </button>
                </section>
            </div>
        </main>
    );
}
