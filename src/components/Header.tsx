import Link from "next/link";
import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b border-white/5 bg-[var(--bg-default)]/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight">ResuMatch Zero</span>
        </Link>

        {/* No Auth Buttons - Tool is Public */}
      </div>
    </header>
  );
}
