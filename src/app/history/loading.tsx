export default function HistoryLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto animate-pulse">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-10 w-40 bg-gray-800 rounded-lg mb-2"></div>
                        <div className="h-5 w-56 bg-gray-800/60 rounded"></div>
                    </div>
                    <div className="h-10 w-28 bg-blue-600/30 rounded-lg"></div>
                </div>

                {/* Scan Cards Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6"
                        >
                            {/* Score Badge Skeleton */}
                            <div className="w-16 h-16 bg-gray-800 rounded-xl shrink-0"></div>

                            {/* Main Info Skeleton */}
                            <div className="flex-1 w-full sm:text-left text-center">
                                <div className="h-6 w-48 bg-gray-800 rounded mb-2 mx-auto sm:mx-0"></div>
                                <div className="h-4 w-32 bg-gray-700 rounded mx-auto sm:mx-0"></div>
                            </div>

                            {/* Action Skeleton */}
                            <div className="w-10 h-10 bg-gray-800 rounded-lg shrink-0"></div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
