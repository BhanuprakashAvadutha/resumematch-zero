import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/auth/actions';

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left: Branding */}
                <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-indigo-400 transition-colors">
                    ResuMatch Zero
                </Link>

                {/* Right: Auth & Navigation */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            href="/history"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                            Dashboard
                        </Link>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </>
                ) : (
                <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                >
                    Sign In
                </Link>
                    )}
            </div>
        </div>
        </header >
    );
}
