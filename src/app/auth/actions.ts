"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    console.log("[LOGIN] Attempting login for:", data.email);
    const { data: authData, error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error("[LOGIN] Error:", error.message);
        return { error: error.message };
    }

    if (!authData.session) {
        console.error("[LOGIN] Success but NO SESSION returned. User might need email confirmation or session could not be created.");
        console.log("[LOGIN] User Data:", JSON.stringify(authData.user, null, 2));
        return { error: "Login failed. Please verify your email or try again." };
    }

    console.log("[LOGIN] Session created successfully.");
    console.log("[LOGIN] Access Token length:", authData.session.access_token?.length || 0);
    console.log("[LOGIN] Refresh Token length:", authData.session.refresh_token?.length || 0);

    revalidatePath("/", "layout");
    redirect("/scanner");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    // Sign up the user
    // We use the origin to construct the callback URL to the existing route.ts
    // The 'next' query param will tell the callback where to go after email confirmation/exchange
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.signUp({
        ...data,
        options: {
            emailRedirectTo: `${origin}/auth/callback?next=/scanner`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    // If email confirmation is disabled in Supabase, this might log them in immediately.
    // If enabled, they need to check email.
    // We'll assume for now we can attempt to redirect or show a "Check email" message.
    // However, simple email/password often creates a session immediately unless "Confirm Email" is on.
    // We will return a success flag so the UI can decide (e.g. "Check your email" or auto-login).

    return { success: true };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
