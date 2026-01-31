export default function HistoryLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-24 flex flex-col items-center justify-center">
            {/* Centered Loading Spinner */}
            <div className="flex flex-col items-center gap-6">
                {/* Animated Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">Loading History</h2>
                    <p className="text-gray-400 text-sm">Retrieving your scan history...</p>
                </div>

                {/* Pulsing dots */}
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
            </div>
        </main>
    );
}
