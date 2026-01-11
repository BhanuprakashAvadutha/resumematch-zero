'use client';

import { useState } from 'react';
import { login, signup } from '@/app/auth/actions';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`text-sm font-medium pb-2 -mb-4 border-b-2 transition-colors ${isLogin
                            ? 'text-white border-indigo-500'
                            : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
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
                                ? 'Enter your credentials to access your history'
                                : 'Start your journey to a better resume'}
                        </p>
                    </div>

                    <form action={isLogin ? login : signup} className="space-y-4">
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
                                <a href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                                    Forgot Password?
                                </a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
