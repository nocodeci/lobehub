"use client";

import Link from "next/link";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const navLinks = [
    { name: "Produits", href: "#products" },
    { name: "Solutions", href: "#solutions" },
    { name: "Entreprise", href: "#about" },
    { name: "Contact", href: "#contact" },
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
                ? "bg-white/70 backdrop-blur-2xl py-4 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border-b border-slate-100"
                : "bg-transparent py-8"
                }`}
        >
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
                <Link href="/" className="group flex items-center transition-all hover:scale-[1.02] active:scale-95">
                    <Logo height={42} />
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-5 py-2 text-[13px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-all relative group flex items-center gap-1"
                        >
                            {link.name}
                            {link.name === "Produits" && <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />}
                            <span className="absolute bottom-1 left-5 right-5 h-[2px] bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-8">
                    <Link
                        href={`${ACCOUNT_URL}/auth/login`}
                        className="hidden text-sm font-black uppercase tracking-widest text-slate-900/60 hover:text-indigo-600 md:block transition-colors"
                    >
                        Accès portail
                    </Link>
                    <Link
                        href={`${ACCOUNT_URL}/auth/register`}
                        className="relative group flex items-center gap-3 rounded-2xl bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 uppercase tracking-widest flex items-center gap-2">
                            Démarrer
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>

                    <button
                        className="lg:hidden text-slate-950 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl lg:hidden overflow-hidden min-h-screen pt-12"
                    >
                        <nav className="flex flex-col p-8 gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-4xl font-black text-slate-950 flex items-center justify-between group"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <ArrowRight className="h-8 w-8 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
                                </Link>
                            ))}
                            <div className="flex flex-col gap-4 mt-12">
                                <Link
                                    href={`${ACCOUNT_URL}/auth/login`}
                                    className="w-full text-center py-6 text-slate-950 font-black border-2 border-slate-100 rounded-3xl uppercase tracking-widest"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href={`${ACCOUNT_URL}/auth/register`}
                                    className="w-full text-center py-6 bg-slate-950 text-white font-black rounded-3xl uppercase tracking-widest"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
