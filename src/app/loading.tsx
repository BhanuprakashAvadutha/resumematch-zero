export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-24 flex flex-col items-center justify-center">
            {/* Centered Loading Spinner */}
            <div className="flex flex-col items-center gap-6">
                {/* Animated Spinner with glow effect */}
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>
                    <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">ResuMatch Zero</h2>
                    <p className="text-gray-400 text-sm">Loading your dashboard...</p>
                </div>

                {/* Pulsing bar */}
                <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>
                </div>
            </div>
        </main>
    );
}
