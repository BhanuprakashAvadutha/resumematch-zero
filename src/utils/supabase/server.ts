import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ MISSING ENV VARIABES IN SERVER CLIENT");
        console.error("URL:", !!supabaseUrl);
        console.error("KEY:", !!supabaseKey);
        // Return a client that essentially fails gracefully or throws a clear error
        // For now, we allow it to proceed so we can see the specific error, 
        // but the console logs above are critical for Vercel logs.
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
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignored in Server Components
                    }
                },
            },
        }
    );
}
