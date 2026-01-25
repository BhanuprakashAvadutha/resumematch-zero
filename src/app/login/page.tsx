'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Validation
        if (mode === 'signup' && fullName.trim().length < 2) {
            setError('Please enter your full name.');
            setIsLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            setIsLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            if (mode === 'signup') {
                // Sign up
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (signUpError) {
                    setError(signUpError.message);
                    setIsLoading(false);
                    return;
                }

                // Auto sign-in after signup
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message);
                    setIsLoading(false);
                    return;
                }
            } else {
                // Sign in
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) {
                    setError(signInError.message);
                    setIsLoading(false);
                    return;
                }
            }

            // FORCE HARD REFRESH - This is the fix!
            window.location.href = "/";

        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Zap size={20} className="text-white" fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold text-white">ResuMatch Zero</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-[#111118] border border-gray-800 rounded-2xl p-6">
                    {/* Toggle */}
                    <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => { setMode('signin'); setError(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'signin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'signup' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    required={mode === 'signup'}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                required
                                minLength={8}
                            />
                            {mode === 'signup' && (
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                mode === 'signin' ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {mode === 'signin' && (
                        <div className="mt-4 text-center">
                            <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    By continuing, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
