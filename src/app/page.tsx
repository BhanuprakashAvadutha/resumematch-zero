import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium text-sm mb-8 border border-blue-500/20">
          <Zap size={16} fill="currentColor" />
          <span>New: GPT-4 Analysis Engine</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          Beat the ATS. <br />
          <span className="text-blue-500">Land the Interview.</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop getting rejected by robots. Our advanced AI scans your resume against job descriptions to reveal exactly what's missing—instantly.
        </p>

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
    </main>
  );
}
