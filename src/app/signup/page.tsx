"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Real-time Email Validation Regex
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Password Strength Calculation and Logic
    useEffect(() => {
        let score = 0;
        if (password.length > 6) score += 1;
        if (password.length > 10) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        setPasswordScore(score);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordScore <= 2) return "bg-red-500";
        if (passwordScore <= 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            // Enterprise Grade specific error handling
            if (signUpError.message.includes("already registered")) {
                setError("This email is already associated with an account. Please log in.");
            } else {
                setError(signUpError.message);
            }
            setIsLoading(false);
        } else {
            // Successful signup - redirect to home (or login if email confirmation required)
            router.push("/");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-default)] text-white px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Create Account</h2>
                        <p className="text-gray-400 text-sm">Join ResuMatch Zero Enterprise</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full bg-gray-950 border ${error && !isValidEmail(email) ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {password.length > 0 && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex gap-1 h-1">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div
                                                key={step}
                                                className={`flex-1 rounded-full transition-colors duration-300 ${passwordScore >= step ? getStrengthColor() : "bg-gray-800"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-right text-gray-500 font-medium">
                                        {passwordScore <= 2 ? "Weak" : passwordScore <= 3 ? "Medium" : "Strong"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-400 select-none cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
