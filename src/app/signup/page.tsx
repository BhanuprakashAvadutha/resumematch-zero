"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await signup(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true);
                // Optional: Redirect immediately if your Supabase settings allow it (e.g. no confirm required)
                // router.push("/scanner"); 
            }
        });
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-default)]">
                <div className="w-full max-w-md text-center">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Account Created!</h2>
                        <p className="text-gray-400 mb-8">
                            Please check your email to confirm your account, or try logging in if you have confirmation disabled.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-default)]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mb-4">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join the top 1% of candidates today</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
