import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ResuMatch Zero | ATS Resume Scanner",
    description: "Beat the bots. Analyze your resume against job descriptions to expose keyword gaps instantly.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-[var(--bg-default)] text-white antialiased`}>
                <Header />
                {children}
            </body>
        </html>
    );
}
