export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 flex flex-col">
            <div className="max-w-5xl mx-auto w-full px-6 py-8 md:py-12 flex-1 flex flex-col animate-pulse">
                {/* Header Skeleton */}
                <div className="mb-8 md:mb-10 text-center sm:text-left">
                    <div className="h-10 w-48 bg-gray-800 rounded-lg mb-3 mx-auto sm:mx-0"></div>
                    <div className="h-5 w-64 bg-gray-800/60 rounded mx-auto sm:mx-0"></div>
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scanner Card Skeleton */}
                    <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-3xl p-6 md:p-8">
                        <div className="w-12 h-12 bg-white/10 rounded-xl mb-6"></div>
                        <div className="h-8 w-32 bg-white/20 rounded mb-3"></div>
                        <div className="h-4 w-48 bg-white/10 rounded mb-6"></div>
                        <div className="h-10 w-36 bg-white/10 rounded-lg"></div>
                    </div>

                    {/* History Card Skeleton */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl mb-6"></div>
                        <div className="h-7 w-32 bg-gray-800 rounded mb-3"></div>
                        <div className="h-4 w-48 bg-gray-800/60 rounded"></div>
                    </div>

                    {/* Profile Card Skeleton */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                        <div className="w-12 h-12 bg-gray-700/30 rounded-xl mb-6"></div>
                        <div className="h-7 w-28 bg-gray-800 rounded mb-3"></div>
                        <div className="h-4 w-44 bg-gray-800/60 rounded"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
