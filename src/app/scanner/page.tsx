import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ScannerSection from "@/components/ScannerSection";

export default async function ScannerPage() {
    const supabase = await createClient();

    console.log("[SCANNER] Checking session...");
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) {
        console.error("[SCANNER] Auth Error:", error.message);
    }

    if (!user) {
        console.warn("[SCANNER] No user found. Redirecting to login.");
        return redirect("/login?error=scanner_unauthorized");
    }

    console.log("[SCANNER] User authenticated:", user.email);

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20">
            <ScannerSection />
        </main>
    );
}
