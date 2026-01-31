export default function ProfileLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto animate-pulse">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-48 bg-gray-800 rounded-lg mb-2"></div>
                    <div className="h-5 w-64 bg-gray-800/60 rounded"></div>
                </div>

                {/* Personal Info Card Skeleton */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 w-48 bg-gray-800 rounded"></div>
                        <div className="h-10 w-28 bg-indigo-600/30 rounded-lg"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                                <div className="h-8 w-full bg-gray-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usage Stats Skeleton */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <div className="h-8 w-36 bg-gray-800 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-24 bg-gray-800/50 rounded-xl"></div>
                        <div className="h-24 bg-gray-800/50 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
