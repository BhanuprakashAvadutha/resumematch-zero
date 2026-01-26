"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is this really free?",
      answer: "Yes! ResuMatch Zero is completely free to use. We believe everyone deserves a fair shot at their dream job."
    },
    {
      question: "Do you store my data?",
      answer: "We store your resume analysis securely so you can access your history. We never share or sell your personal data to third parties."
    },
    {
      question: "How does the score work?",
      answer: "Our proprietary algorithm uses advanced keyword matching and semantic analysis to compare your resume against the job description, mimicking how real ATS systems work."
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-default)] text-white pt-20 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
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

      {/* FAQ Section */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-800 rounded-xl bg-gray-900/30 overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {openFaq === i ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-gray-500" />}
                </button>
                {openFaq === i && (
                  <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50 mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2024 ResuMatch Zero. All rights reserved.</p>
      </footer>
    </main>
  );
}
