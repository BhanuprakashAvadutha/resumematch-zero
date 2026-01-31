"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError) {
            setError(signInError.message);
        } else {
            router.push("/"); // Redirect to home page after login
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded px-3 py-2 bg-gray-700 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded px-3 py-2 bg-gray-700 focus:outline-none"
                />
                <button
                    type="submit"
                    className="w-full rounded bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold"
                >
                    Sign In
                </button>
                <p className="text-center text-sm">
                    Don’t have an account? <a href="/signup" className="text-indigo-400 hover:underline">Sign Up</a>
                </p>
            </form>
        </div>
    );
}
