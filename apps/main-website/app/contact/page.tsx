"use client";

import { useState, FormEvent } from "react";
import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error || "Une erreur est survenue.");
                setStatus("error");
            } else {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
            }
        } catch {
            setErrorMsg("Erreur de connexion. Veuillez réessayer.");
            setStatus("error");
        }
    };

    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
            {/* Navbar */}
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            {/* Hero */}
            <section className="w-full pt-32 pb-20 px-4" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        Contact
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        Parlons de votre projet
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Une question, un projet ou un partenariat ? Notre équipe vous répond sous 24 heures.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="w-full max-w-6xl mx-auto px-4 -mt-10 relative z-10 pb-20">
                <div className="grid lg:grid-cols-5 gap-8">

                    {/* Form */}
                    <div className="lg:col-span-3 bg-white rounded-2xl p-8 md:p-10" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                        {status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgb(34,197,94,0.1)" }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
                                <p className="text-gray-500 mb-8">Nous vous répondrons dans les plus brefs délais.</p>
                                <button onClick={() => setStatus("idle")} className="px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "rgb(26,26,26)" }}>
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ letterSpacing: "-0.01em" }}>
                                    Envoyez-nous un message
                                </h2>
                                <p className="text-sm text-gray-400 mb-8">Tous les champs sont obligatoires.</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Votre nom"
                                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-gray-900/10"
                                            style={{ background: "rgb(245,245,245)", border: "1px solid rgb(230,230,230)" }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="vous@exemple.com"
                                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-gray-900/10"
                                            style={{ background: "rgb(245,245,245)", border: "1px solid rgb(230,230,230)" }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Décrivez votre projet ou posez votre question..."
                                            className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none focus:ring-2 focus:ring-gray-900/10"
                                            style={{ background: "rgb(245,245,245)", border: "1px solid rgb(230,230,230)" }}
                                        />
                                    </div>

                                    {status === "error" && (
                                        <div className="px-4 py-3 rounded-xl text-sm text-red-600" style={{ background: "rgba(239,68,68,0.08)" }}>
                                            {errorMsg}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
                                        style={{ background: "rgb(26,26,26)" }}
                                    >
                                        {status === "sending" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                Envoi en cours...
                                            </span>
                                        ) : "Envoyer le message"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Info Cards */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {/* Email */}
                        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(26,26,26,0.05)" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(26,26,26)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Email</h3>
                            <a href="mailto:contact@wozif.com" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                                contact@wozif.com
                            </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,211,102,0.08)" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgb(37,211,102)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">WhatsApp</h3>
                            <a href="https://wa.me/2250700000000" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                                +225 07 00 00 00 00
                            </a>
                        </div>

                        {/* Localisation */}
                        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(26,26,26,0.05)" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(26,26,26)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Localisation</h3>
                            <p className="text-sm text-gray-500">Abidjan, Côte d&apos;Ivoire</p>
                        </div>

                        {/* Horaires */}
                        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(26,26,26,0.05)" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(26,26,26)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Horaires</h3>
                            <p className="text-sm text-gray-500">Lun - Ven : 8h - 18h (GMT)</p>
                            <p className="text-sm text-gray-500">Sam : 9h - 13h</p>
                        </div>

                        {/* Réseaux */}
                        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Suivez-nous</h3>
                            <div className="flex gap-3">
                                {[
                                    { label: "X", href: "#" },
                                    { label: "Li", href: "#" },
                                    { label: "Ig", href: "#" },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 transition-all hover:text-white hover:bg-gray-900"
                                        style={{ background: "rgb(245,245,245)" }}
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
