import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Trophy, FileEdit, TrendingUp } from "lucide-react";
import { getUser, createClient } from "@/utils/supabase/server";
import FaqSection from "@/components/FaqSection";

// Fetch user's best score from scan history
async function getBestScore(userId: string): Promise<{ score: number | null; totalScans: number }> {
  const supabase = await createClient();

  const { data: scans, error } = await supabase
    .from("scans")
    .select("score")
    .eq("user_id", userId)
    .order("score", { ascending: false })
    .limit(100);

  if (error || !scans || scans.length === 0) {
    return { score: null, totalScans: 0 };
  }

  const bestScore = Math.max(...scans.map(s => s.score || 0));
  return { score: bestScore, totalScans: scans.length };
}

// Get user's display name from email
function getDisplayName(email: string): string {
  // Extract name from email (before @)
  const name = email.split("@")[0];
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async function Home() {
  const { user } = await getUser();

  // Fetch best score if user is logged in
  let bestScore: number | null = null;
  let totalScans = 0;
  let displayName = "";

  if (user) {
    const scoreData = await getBestScore(user.id);
    bestScore = scoreData.score;
    totalScans = scoreData.totalScans;
    displayName = getDisplayName(user.email || "User");
  }

  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white pt-24 flex flex-col">
      {user ? (
        // --- LOGGED IN PERSONALIZED DASHBOARD ---
        <div className="max-w-4xl mx-auto w-full px-6 py-8 md:py-16 flex-1 flex flex-col">
          {/* Personalized Welcome */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Welcome back, <span className="text-blue-400">{displayName}</span>! 👋
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Ready to land your dream job?
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Best Score Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Your Best Score</p>
                {bestScore !== null ? (
                  <p className="text-3xl font-bold text-white">
                    {bestScore}
                    <span className="text-lg text-gray-400 font-normal">%</span>
                  </p>
                ) : (
                  <p className="text-xl font-semibold text-gray-500">No scans yet</p>
                )}
              </div>
            </div>

            {/* Total Scans Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-white">{totalScans}</p>
              </div>
            </div>
          </div>

          {/* Primary CTA - Build Resume */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden mb-8">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileEdit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Build Your Perfect Resume
              </h2>
              <p className="text-blue-100/80 mb-8 max-w-lg mx-auto">
                Create an ATS-optimized resume with our intelligent builder.
                Import your existing resume or start fresh!
              </p>
              <Link
                href="/resume/builder"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105 active:scale-95"
              >
                Build Resume Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Tip */}
          {bestScore !== null && bestScore < 80 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-yellow-400 text-sm">
                💡 <strong>Tip:</strong> Scores above 80% have a higher chance of passing ATS filters.
                Try the Scanner to improve your match rate!
              </p>
            </div>
          )}
        </div>
      ) : (
        // --- GUEST LANDING PAGE ---
        <div>
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs md:text-sm mb-6 md:mb-8 border border-blue-500/20">
              <Zap size={14} className="md:w-4 md:h-4" fill="currentColor" />
              <span>New: Enterprise-Grade V2.0 Engine</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Beat the ATS. <br />
              <span className="text-blue-500">Land the Interview.</span>
            </h1>

            <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Our logic engine scans your resume against job descriptions to reveal exactly what's missing—instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all border border-gray-700"
              >
                Sign In
              </Link>
            </div>
          </section>

          {/* Features Grid */}
          <section className="px-6 py-12 md:py-20 border-t border-white/5 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                <div key={i} className="p-6 md:p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
                  <div className="mb-4 md:mb-6 bg-gray-950 w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center border border-gray-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{feature.desc}</p>
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
