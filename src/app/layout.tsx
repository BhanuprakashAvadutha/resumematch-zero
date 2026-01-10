import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ResuMatch Zero | Free ATS Resume Scanner",
    description: "Stop getting rejected by bots. Scan your resume against job descriptions for free. AI-powered, 100% private.",
    keywords: ["ATS scanner", "resume optimizer", "AI resume builder", "free resume checker"],
    openGraph: {
        title: "ResuMatch Zero | Free ATS Resume Scanner",
        description: "Stop getting rejected by bots. Scan your resume against job descriptions for free.",
        siteName: "ResuMatch Zero",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-black text-white min-h-screen pt-16 selection:bg-indigo-500/30`}>
                <Header />
                {children}
            </body>
        </html>
    );
}
