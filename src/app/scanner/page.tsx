import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ScannerSection from "@/components/ScannerSection";

export default async function ScannerPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20">
            <ScannerSection />
        </main>
    );
}
