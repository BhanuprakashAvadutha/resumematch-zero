'use client';

import { useEffect } from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-950/30 border border-red-500/20 text-red-500 mb-4 animate-pulse">
                    <AlertOctagon className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase glitch-text">
                        System Overload
                    </h1>
                    <p className="text-gray-400">
                        The AI is overwhelmed. Our neural networks are cooling down.
                    </p>
                </div>

                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-xl transition-all"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
