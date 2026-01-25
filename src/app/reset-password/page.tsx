'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setIsValidSession(true);
            } else {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const type = hashParams.get('type');
                if (type === 'recovery') {
                    setIsValidSession(true);
                } else {
                    setIsValidSession(false);
                }
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }

        startTransition(async () => {
            try {
                const supabase = createClient();
                const { error } = await supabase.auth.updateUser({ password });

                if (error) {
                    setError(error.message);
                } else {
                    setSuccess(true);
                    await supabase.auth.signOut();
                }
            } catch (e: any) {
                setError(e.message || 'Failed to update password. Please try again.');
            }
        });
    };

    if (isValidSession === null) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (isValidSession === false) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Invalid or Expired Link</h1>
                    <p className="text-gray-400 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
                    <p className="text-gray-400 mb-6">
                        Your password has been successfully changed. You can now sign in with your new password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-indigo-400" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                    <p className="text-gray-400 text-sm">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            placeholder="••••••••"
                        />
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
                                Updating Password...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
