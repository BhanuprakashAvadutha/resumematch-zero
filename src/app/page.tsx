import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, LayoutDashboard, History, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import FaqSection from "@/components/FaqSection";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 flex flex-col">
      {user ? (
        // --- LOGGED IN DASHBOARD ---
        <div className="max-w-5xl mx-auto w-full px-6 py-12 flex-1 flex flex-col">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-gray-400">What would you like to do today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Scanner Card */}
            <Link
              href="/scanner"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6">
                  <LayoutDashboard size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">New Scan</h3>
                <p className="text-blue-100/80 mb-6">Analyze a resume against a job description.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold group-hover:bg-white/20 transition-colors">
                  Launch Scanner <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* 2. History Card */}
            <Link
              href="/history"
              className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-3xl p-8 transition-all hover:bg-gray-800/50"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                <History size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scan History</h3>
              <p className="text-gray-400">View past analyses and track your improvements over time.</p>
            </Link>

            {/* 3. Profile Card */}
            <Link
              href="/profile"
              className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-3xl p-8 transition-all hover:bg-gray-800/50"
            >
              <div className="w-12 h-12 bg-gray-700/30 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-gray-700/50 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">My Profile</h3>
              <p className="text-gray-400">Manage account settings and subscription details.</p>
            </Link>
          </div>
        </div>
      ) : (
        // --- GUEST LANDING PAGE ---
        <div>
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium text-sm mb-8 border border-blue-500/20">
              <Zap size={16} fill="currentColor" />
              <span>New: Enterprise-Grade V2.0 Engine</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Beat the ATS. <br />
              <span className="text-blue-500">Land the Interview.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our logic engine scans your resume against job descriptions to reveal exactly what's missing—instantly.
            </p>

            {/* Restored Buttons for Guests */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl font-bold text-lg transition-all"
              >
                Sign In
              </Link>
            </div>
          </section>

          {/* Features Grid */}
          <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="text-yellow-400" size={32} />,
                  title: "Instant Match Score",
                  desc: "Get a quantitative score (0-100%) showing how well your resume fits the job description."
                },
                {
                  icon: <CheckCircle2 className="text-green-400" size={32} />,
                  title: "Keyword Gap Analysis",
                  desc: "Identify critical skills and keywords missing from your resume that the ATS is looking for."
                },
                {
                  icon: <ShieldCheck className="text-blue-400" size={32} />,
                  title: "Secure & Private",
                  desc: "Your data is encrypted and secure. We never share your resume with third parties."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
                  <div className="mb-6 bg-gray-950 w-16 h-16 rounded-xl flex items-center justify-center border border-gray-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <FaqSection />
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 mt-auto">
        <p>© 2024 ResuMatch Zero. All rights reserved.</p>
      </footer>
    </main>
  );
}
