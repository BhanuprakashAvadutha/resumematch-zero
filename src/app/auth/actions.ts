'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new Error(error.message); // In a real app, return error to form
    }
    // Revalidate the root or dashboard path as needed
    revalidatePath('/');
    // Optionally redirect after login
    redirect('/');
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
        throw new Error(error.message);
    }
    revalidatePath('/');
    redirect('/');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    // Revalidate auth‑related paths
    revalidatePath('/login');
    redirect('/login');
}
