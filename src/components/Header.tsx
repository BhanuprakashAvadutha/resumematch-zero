import Link from "next/link";
import { Zap, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions"; // We'll make a server action for this

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 w-full border-b border-white/5 bg-[var(--bg-default)]/80 backdrop-blur-md z-50 no-print">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ResuMatch Zero</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:inline-block">
                {user.email}
              </span>
              <form action={logout}>
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </form>
              <Link
                href="/scanner"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all"
              >
                Scanner
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
