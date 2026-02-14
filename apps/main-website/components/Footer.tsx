"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {/* Legal */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-slate-950 mb-4">Légal</h4>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/terms" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Termes et services</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-slate-950 mb-4">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/support" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Centre d&apos;aide</Link></li>
                            <li>
                                <Link href="/status" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Statut des services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Entreprise */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-slate-950 mb-4">Entreprise</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">À propos</Link></li>
                            <li><Link href="/careers" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Carrières</Link></li>
                            <li><Link href="/contact" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="text-[13px] font-semibold text-slate-950 mb-4">Solutions</h4>
                        <ul className="space-y-3">
                            <li><Link href="https://app.connect.wozif.com" className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors">Connect</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/">
                        <Logo height={28} />
                    </Link>
                    <p className="text-[12px] text-slate-400">
                        © {new Date().getFullYear()} Wozif Technologies. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
