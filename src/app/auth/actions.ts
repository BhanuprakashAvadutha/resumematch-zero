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
        throw new Error(error.message);
    }
    revalidatePath('/');
    redirect('/');
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    // Password validation
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    // After successful signup, attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
        console.warn('Signup successful, but sign in failed:', signInError.message);
    }

    revalidatePath('/');
    redirect('/');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/login');
    redirect('/login');
}
