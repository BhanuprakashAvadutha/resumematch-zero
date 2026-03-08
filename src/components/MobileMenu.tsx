"use client";

import { useState } from "react";
import Link from "next/link";
import { History, User, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { ScanTextIcon } from "@/components/icons/ScanTextIcon";
import { FileTextIcon } from "@/components/icons/FileTextIcon";

export default function MobileMenu({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    if (!user) return null;

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 top-16 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Panel */}
            <div
                className={`fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col p-6 gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <HomeIcon size={18} />
                        </div>
                        Home
                    </Link>
                    <Link
                        href="/premium"
                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <ScanTextIcon size={18} />
                        </div>
                        ATS Scanner
                    </Link>
                    <Link
                        href="/resume/builder"
                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <FileTextIcon size={18} />
                        </div>
                        Resume Builder
                    </Link>
                    <Link
                        href="/history"
                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <History size={18} />
                        </div>
                        History
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gray-700/30 flex items-center justify-center text-gray-400">
                            <User size={18} />
                        </div>
                        Profile
                    </Link>

                    <hr className="border-gray-800" />

                    <form action={logout}>
                        <button
                            className="flex items-center gap-3 text-lg font-medium text-red-400 hover:text-red-300 transition-colors w-full"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <LogOut size={18} />
                            </div>
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
