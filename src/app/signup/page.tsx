"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.replace('/');
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleSubmit = async (formData: FormData) => {
        setError(null);

        const password = formData.get("password") as string;
        const confirm = formData.get("confirmPassword") as string;
        const fullName = formData.get("fullName") as string;

        if (!fullName || fullName.trim().length < 2) {
            setError("Please enter your full name.");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        startTransition(async () => {
            try {
                await signup(formData);
                router.refresh();
            } catch (e: any) {
                const message = e.message || '';

                if (message.includes('User already registered')) {
                    setError('User already exists. Please sign in instead.');
                } else if (message.includes('Password should be')) {
                    setError('Password must be at least 8 characters long.');
                } else {
                    setError(message || "Signup failed. Please try again.");
                }
            }
        });
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-default)]">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-default)] px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm">Join ResuMatch Enterprise</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Password must be at least 8 characters</p>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
