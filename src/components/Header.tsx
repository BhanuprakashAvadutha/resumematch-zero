import Link from "next/link";
import { Zap, LogOut, User, History as HistoryIcon, LayoutDashboard, Home } from "lucide-react";
import { getUser } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions";
import MobileMenu from "@/components/MobileMenu";

export default async function Header() {
  let user = null;

  try {
    const result = await getUser();
    user = result.user;
  } catch (error) {
    console.error("Header: Error fetching user:", error);
    // Continue with user = null to show guest header
  }

  return (
    <header className="fixed top-0 w-full border-b border-white/5 bg-[var(--bg-default)]/80 backdrop-blur-md z-50 no-print">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ResuMatch Zero</span>
        </Link>

        {/* Navigation - Right */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Desktop Nav - Logged In */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Home size={16} /> Home
                </Link>
                <Link
                  href="/scanner"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={16} /> Scanner
                </Link>
                <Link
                  href="/history"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HistoryIcon size={16} /> History
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <User size={16} /> Profile
                </Link>
              </nav>

              <div className="h-6 w-px bg-gray-800 hidden md:block" />

              <form action={logout} className="hidden md:block">
                <button
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-800/50"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </form>

              {/* Mobile Nav */}
              <MobileMenu user={user} />
            </>
          ) : (
            <div className="flex items-center gap-4">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
