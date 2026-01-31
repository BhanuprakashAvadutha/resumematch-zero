// Server Component (default in Next.js App Router)

import { redirect } from "next/navigation";
import { createClient, getUser } from "@/utils/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
    let user = null;
    let profile = null;
    let scansCount = 0;

    // Defensive Data Fetching
    try {
        // 1. Get User (uses cached getUser - deduped with Header)
        const { user: authUser, error: userError } = await getUser();
        if (userError || !authUser) {
            console.error("Auth Error or No User:", userError);
            // Redirect unauthenticated users
            redirect("/login?next=/profile");
        }
        user = authUser;

        const supabase = await createClient();

        // 2. Fetch Profile
        // We use maybeSingle() instead of single() to avoid PGRST116 (0 rows) error turning into an exception if library throws it.
        // NOTE: Column is 'tier' in DB but we alias it as 'plan' for frontend compatibility
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id,full_name,email,tier,credits,linkedin_url,primary_role,experience_level")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
            console.error("Profile Fetch Error:", profileError);
            // We continue, allowing profile to be null
        }
        profile = profileData;

        // 3. Fetch Scans Count
        const { count, error: countError } = await supabase
            .from("scans")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

        if (countError) {
            console.error("Scans Count Error:", countError);
        }
        scansCount = count ?? 0;

    } catch (err: any) {
        // Re-throw Next.js internal errors (NEXT_REDIRECT, DYNAMIC_SERVER_USAGE, etc.)
        // These are not real errors but signals for the framework
        const digest = err?.digest || "";
        if (
            digest.startsWith("NEXT_REDIRECT") ||
            digest === "DYNAMIC_SERVER_USAGE" ||
            err?.message?.includes("Dynamic server usage")
        ) {
            throw err;
        }
        console.error("CRITICAL SERVER ERROR in ProfilePage:", err);
        // We render the page with empty data instead of crashing explicitly
    }

    if (!user) {
        // Should have redirected, but just in case redirect now
        redirect("/login?next=/profile");
    }

    const badge = profile?.tier === "pro" ? { label: "Pro", color: "bg-yellow-400" } : { label: "Free Tier", color: "bg-gray-500" };

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
                <ProfileForm initialProfile={profile} userId={user.id} userEmail={user.email || ""} />

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
                        try {
                            const supabase = await createClient();
                            await supabase.auth.signOut();
                        } catch (e) {
                            console.error("Signout Error", e);
                        }
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
