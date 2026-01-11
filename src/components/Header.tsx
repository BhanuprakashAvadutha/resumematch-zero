import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Zap } from "lucide-react";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 w-full border-b border-white/5 bg-[var(--bg-default)]/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight">ResuMatch Zero</span>
        </Link>

        {/* Right Side */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                href="/history" 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <form action={signOut}>
                <button className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
