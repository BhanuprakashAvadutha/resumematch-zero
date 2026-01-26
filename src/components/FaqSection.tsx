"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FaqSection() {
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
    );
}
