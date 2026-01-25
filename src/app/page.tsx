import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Shield, Zap, TrendingUp } from "lucide-react";
import ScannerSection from "@/components/ScannerSection";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. IF LOGGED IN: Show Scanner
  if (user) {
    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    return (
      <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20">
        <ScannerSection userName={name} />
      </main>
    );
  }

  // 2. IF GUEST: Show Marketing Landing Page
  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white font-sans selection:bg-blue-500/30">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Enterprise-Grade ATS Scanner
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Beat the Bots. <br /> Land the Interview.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing keywords. Our State of the Art AI analyzes your resume against job descriptions to expose gaps instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-bold text-lg border border-gray-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 border-y border-white/5 bg-white/2">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-8">Optimized for</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {["Greenhouse", "Lever", "Workday", "Taleo", "iCIMS"].map((name) => (
              <span key={name} className="text-xl font-bold text-gray-300">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Instant Analysis", desc: "Get a match score in seconds. No AI waiting times." },
            { icon: Shield, title: "100% Private", desc: "Your data is encrypted. We don't sell info to recruiters." },
            { icon: TrendingUp, title: "Actionable Tips", desc: "Don't just see a score. Get a step-by-step guide to improve." }
          ].map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-blue-500/30 transition-colors">
              <f.icon className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
