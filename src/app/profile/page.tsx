"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProfileForm from "@/components/ProfileForm";

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
        .select("id,full_name,email,plan,linkedin_url,primary_role,experience_level")
        .eq("id", user.id)
        .single();

    // Fetch total scans count for this user
    const { count: scansCount } = await supabase
        .from("scans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

    const badge = profile?.plan === "pro" ? { label: "Pro", color: "bg-yellow-400" } : { label: "Free Tier", color: "bg-gray-500" };

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">My Account</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} text-black`}>
                        {badge.label}
                    </span>
                </div>

                {/* Profile Form Component */}
                <ProfileForm initialProfile={profile} />

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
                <section className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-800">
                    <form action={async () => {
                        "use server";
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                        redirect("/login");
                    }} className="w-full sm:w-auto">
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors">
                            Sign Out
                        </button>
                    </form>
                    <button
                        // onClick={() => alert("Password update flow not implemented yet.")} 
                        // Note: This is a server component, standard onClick won't work without a client component wrapper or form action.
                        // Leaving as static styling for now or standard button type="button" if we were in client context.
                        type="button"
                        className="w-full sm:w-auto px-6 py-2 border border-indigo-400 hover:bg-indigo-900 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed"
                        disabled
                    >
                        Update Password (Coming Soon)
                    </button>
                </section>
            </div>
        </main>
    );
}
