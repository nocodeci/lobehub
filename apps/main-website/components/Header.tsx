"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const navLinks = [
    { name: "Solutions", href: "/products" },
    { name: "Compte", href: "/account" },
    { name: "À propos", href: "/about" },
];

const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL || "https://account.wozif.com";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                ? "bg-white/80 backdrop-blur-2xl py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
                : "bg-transparent py-6"
                }`}
        >
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 lg:px-8">
                <Link href="/" className="group flex items-center transition-all hover:scale-[1.02] active:scale-95">
                    <Logo height={36} />
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2 text-[14px] font-semibold text-slate-600 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-50"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href={`${ACCOUNT_URL}/auth/login`}
                        className="hidden text-[14px] font-semibold text-slate-600 hover:text-slate-950 md:block transition-colors"
                    >
                        Se connecter
                    </Link>
                    <Link
                        href={`${ACCOUNT_URL}/auth/register`}
                        className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-slate-800 active:scale-95"
                    >
                        S&apos;inscrire
                    </Link>

                    <button
                        className="lg:hidden text-slate-950 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg lg:hidden"
                    >
                        <nav className="flex flex-col p-6 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col gap-3">
                                <Link
                                    href={`${ACCOUNT_URL}/auth/login`}
                                    className="w-full text-center py-3 text-slate-700 font-semibold border border-slate-200 rounded-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href={`${ACCOUNT_URL}/auth/register`}
                                    className="w-full text-center py-3 bg-slate-950 text-white font-semibold rounded-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    S&apos;inscrire
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
