'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/app/auth/actions';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    // Check if user is already logged in - redirect to home
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

        // Client-side validation for signup
        if (!isLogin) {
            const password = formData.get('password') as string;
            const fullName = formData.get('fullName') as string;

            if (!fullName || fullName.trim().length < 2) {
                setError('Please enter your full name.');
                return;
            }

            if (password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }
        }

        startTransition(async () => {
            try {
                if (isLogin) {
                    await login(formData);
                } else {
                    await signup(formData);
                }
                router.refresh();
            } catch (e: any) {
                const message = e.message || '';

                if (message.includes('Invalid login credentials')) {
                    setError('Password is incorrect. Please try again.');
                } else if (message.includes('User already registered')) {
                    setError('User already exists. Please sign in instead.');
                } else if (message.includes('Email not confirmed')) {
                    setError('Please confirm your email before signing in.');
                } else if (message.includes('invalid_credentials')) {
                    setError('Password is incorrect. Please try again.');
                } else {
                    setError(message || 'Authentication failed. Please try again.');
                }
            }
        });
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`text-sm font-medium pb-2 -mb-4 border-b-2 transition-colors ${isLogin
                                ? 'text-white border-indigo-500'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`text-sm font-medium pb-2 -mb-4 border-b-2 transition-colors ${!isLogin
                                ? 'text-white border-indigo-500'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            {isLogin
                                ? 'Enter your credentials to access your dashboard'
                                : 'Start your journey to a better resume'}
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        {/* Full Name - Only for Sign Up */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required={!isLogin}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                {isLogin && (
                                    <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                                        Forgot Password?
                                    </a>
                                )}
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                            {!isLogin && (
                                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
