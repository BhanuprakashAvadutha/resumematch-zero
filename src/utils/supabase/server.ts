import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ MISSING ENV VARIABES IN SERVER CLIENT");
    }

    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                    try {
                        console.log(`[SUPABASE] Setting ${cookiesToSet.length} cookies...`);
                        cookiesToSet.forEach(({ name, value, options }) => {
                            console.log(`[SUPABASE] Setting Cookie: ${name}`);
                            cookieStore.set(name, value, options);
                        });
                    } catch (err) {
                        console.error("[SUPABASE] Failed to set cookies:", err);
                        // Ignored in Server Components
                    }
                },
            },
        }
    );
}
