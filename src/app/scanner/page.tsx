"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ScannerSection from "@/components/ScannerSection";

export default function ScannerPage() {
    const router = useRouter();
    const supabase = createClient();
    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/login");
            } else {
                setUserLoaded(true);
            }
        };
        checkAuth();
    }, [supabase, router]);

    if (!userLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    return <ScannerSection />;
}
