export default function SignupLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white flex items-center justify-center">
            {/* Centered Loading Spinner */}
            <div className="flex flex-col items-center gap-6">
                {/* Animated Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Loading sign up...</p>
                </div>
            </div>
        </main>
    );
}
