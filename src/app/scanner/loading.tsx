export default function ScannerLoading() {
    return (
        <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full px-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="text-center mb-8">
                    <div className="h-10 w-80 bg-gray-800 rounded-lg mx-auto mb-4"></div>
                    <div className="h-5 w-48 bg-gray-800/60 rounded mx-auto"></div>
                </div>

                {/* Upload Box Skeleton */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
                    <div className="h-6 w-32 bg-gray-800 rounded mb-6"></div>
                    <div className="h-40 w-full bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    </div>

                    {/* Job Description Skeleton */}
                    <div className="mt-8">
                        <div className="h-6 w-40 bg-gray-800 rounded mb-4"></div>
                        <div className="h-32 w-full bg-gray-800/50 rounded-xl"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-8 h-12 w-full bg-blue-600/30 rounded-xl"></div>
                </div>
            </div>
        </main>
    );
}
