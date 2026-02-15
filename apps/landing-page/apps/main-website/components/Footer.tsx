"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github, ArrowUpRight, Instagram } from "lucide-react";
import Logo from "./Logo";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-white pt-32 pb-16 border-t border-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    <div className="col-span-2 lg:col-span-4">
                        <Link href="/" className="mb-8 block transition-transform hover:scale-[1.02] active:scale-95 origin-left">
                            <Logo height={45} />
                        </Link>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm mb-12">
                            L&apos;infrastructure digitale qui libère le potentiel économique de l&apos;Afrique.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[11px]">Écosystème</h4>
                        <ul className="space-y-5 font-bold text-slate-500 text-sm">
                            <li><Link href="/products/gnata" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">Gnata <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" /></Link></li>
                            <li><Link href="/products/afriflow" className="hover:text-indigo-600 transition-colors flex items-center gap-2 group">AfriFlow <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" /></Link></li>
                            <li><Link href="#" className="flex items-center gap-2 opacity-40 cursor-not-allowed">Wozif Cloud <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase">Bientôt</span></Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[11px]">Compagnie</h4>
                        <ul className="space-y-5 font-bold text-slate-500 text-sm">
                            <li><Link href="/about" className="hover:text-indigo-600 transition-colors">Notre Vision</Link></li>
                            <li><Link href="/careers" className="hover:text-indigo-600 transition-colors flex items-center gap-2">Carrières <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] animate-pulse">On recrute</span></Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4 lg:pl-12">
                        <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                            <h4 className="font-black text-slate-950 mb-4 uppercase tracking-tighter text-lg">Restez à l&apos;avant-garde</h4>
                            <p className="text-slate-500 text-sm mb-6 font-medium">Recevez nos dernières innovations et analyses du marché africain.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20" />
                                <button className="px-4 py-3 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">Ok</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <p className="text-slate-400 text-sm font-bold tracking-tight">
                            © 2026 Wozif Technologies SG.
                        </p>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <p className="text-slate-400 text-sm font-bold tracking-tight uppercase">Dakar</p>
                    </div>

                    <div className="flex items-center gap-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Link href="/privacy" className="hover:text-slate-950 transition-colors">Confidentialité</Link>
                        <Link href="/terms" className="hover:text-slate-950 transition-colors">Légal</Link>
                        <Link href="#" className="hover:text-slate-950 transition-colors flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Systèmes OP
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
