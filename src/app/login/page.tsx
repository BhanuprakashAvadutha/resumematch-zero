'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Zap, Bug } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<any>(null);
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const log = (message: string) => {
        console.log(`[LOGIN DEBUG] ${message}`);
        setDebugLog(prev => [...prev, `${new Date().toISOString().slice(11, 19)} - ${message}`]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setDebugLog([]);
        setIsLoading(true);

        log(`Starting login for: ${email}`);

        // Step 1: Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        log(`SUPABASE_URL exists: ${!!supabaseUrl}`);
        log(`SUPABASE_KEY exists: ${!!supabaseKey}`);

        if (!supabaseUrl || !supabaseKey) {
            const envError = { message: "MISSING ENV VARS", supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey };
            setError(envError);
            setIsLoading(false);
            return;
        }

        // Step 2: Create Supabase client
        log("Creating Supabase browser client...");
        let supabase;
        try {
            supabase = createBrowserClient(supabaseUrl, supabaseKey);
            log("Supabase client created successfully");
        } catch (clientError: any) {
            log(`FAILED to create client: ${clientError.message}`);
            setError({ type: "CLIENT_CREATION_FAILED", error: clientError });
            setIsLoading(false);
            return;
        }

        // Step 3: Attempt sign in
        log(`Calling signInWithPassword...`);
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            log(`Sign in response received`);
            log(`Data: ${JSON.stringify(data)}`);
            log(`Error: ${signInError ? JSON.stringify(signInError) : 'null'}`);

            if (signInError) {
                log(`SIGN IN FAILED: ${signInError.message}`);
                setError({
                    type: "SIGN_IN_ERROR",
                    message: signInError.message,
                    status: signInError.status,
                    fullError: signInError,
                });
                setIsLoading(false);
                return;
            }

            if (!data.user) {
                log("No user returned - possible email confirmation required");
                setError({
                    type: "NO_USER_RETURNED",
                    message: "Sign in succeeded but no user was returned. Check if email confirmation is enabled.",
                    data: data,
                });
                setIsLoading(false);
                return;
            }

            // Step 4: SUCCESS!
            log(`SUCCESS! User ID: ${data.user.id}`);
            log(`User Email: ${data.user.email}`);
            log("Triggering hard redirect...");

            alert("LOGIN SUCCESS! Redirecting to Dashboard...");
            window.location.href = "/";

        } catch (catchError: any) {
            log(`CATCH ERROR: ${catchError.message}`);
            setError({
                type: "UNEXPECTED_ERROR",
                message: catchError.message,
                stack: catchError.stack,
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Zap size={20} className="text-white" fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold text-white">ResuMatch Zero</span>
                    </Link>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                        <Bug size={12} /> DEBUG MODE
                    </div>
                </div>

                {/* Card */}
                <div className="bg-[#111118] border border-gray-800 rounded-2xl p-6">
                    <h1 className="text-xl font-bold text-white mb-4">Sign In (Debug)</h1>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
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
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-gray-500 text-sm">Don't have an account? </span>
                        <Link href="/signup" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Debug Log */}
                {debugLog.length > 0 && (
                    <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-green-400 mb-2">📋 Debug Log</h3>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                            {debugLog.join('\n')}
                        </pre>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-red-400 mb-2">🚨 ERROR DUMP</h3>
                        <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono overflow-auto max-h-64">
                            {JSON.stringify(error, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    Open browser DevTools (F12) → Console tab to see full logs
                </div>
            </div>
        </div>
    );
}
