'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        startTransition(async () => {
            try {
                const supabase = createClient();
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) {
                    setError(error.message);
                } else {
                    setSuccess(true);
                }
            } catch (e: any) {
                setError(e.message || 'Failed to send reset email. Please try again.');
            }
        });
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                    <p className="text-gray-400 mb-6">
                        We've sent a password reset link to <strong className="text-white">{email}</strong>.
                        Click the link in the email to create a new password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Sign In
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
                        <Mail className="text-indigo-400" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-gray-400 text-sm">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            placeholder="you@example.com"
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
                                Sending Reset Link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
