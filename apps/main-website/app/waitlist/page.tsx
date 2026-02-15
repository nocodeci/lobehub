"use client";

import { useState, FormEvent } from "react";
import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";

const products = [
    { id: "connect", name: "Connect", description: "Automatisation WhatsApp avec IA", color: "#FF7A00" },
    { id: "gnata", name: "Gnata", description: "Votre site web en 1 heure", color: "#10B981" },
    { id: "afriflow", name: "AfriFlow", description: "Orchestrateur de paiements africains", color: "#3B82F6" },
];

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const toggleProduct = (id: string) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    message: `[WAITLIST] Produits: ${selectedProducts.join(", ") || "Non spécifié"}`,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error || "Une erreur est survenue.");
                setStatus("error");
            } else {
                setStatus("success");
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
            <section className="w-full pt-32 pb-24 px-4 relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,122,0,0.15)", color: "rgb(255,122,0)", border: "1px solid rgba(255,122,0,0.2)" }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "rgb(255,122,0)" }} />
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "rgb(255,122,0)" }} />
                        </span>
                        Accès anticipé
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        Rejoignez la liste d&apos;attente
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Soyez parmi les premiers à accéder à nos solutions. Inscrivez-vous et recevez une invitation dès le lancement.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            <span className="text-sm">Gratuit</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            <span className="text-sm">Sans engagement</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            <span className="text-sm">Accès prioritaire</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="w-full max-w-xl mx-auto px-4 -mt-12 relative z-10 pb-20">
                <div className="bg-white rounded-2xl p-8 md:p-10" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)" }}>
                    {status === "success" ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(34,197,94,0.1)" }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous êtes inscrit !</h2>
                            <p className="text-gray-500 mb-2">Merci <span className="font-medium text-gray-700">{name}</span> pour votre inscription.</p>
                            <p className="text-gray-400 text-sm">Nous vous enverrons une invitation à <span className="font-medium text-gray-600">{email}</span> dès que votre accès sera prêt.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ letterSpacing: "-0.01em" }}>
                                Inscrivez-vous
                            </h2>
                            <p className="text-sm text-gray-400 mb-8">Recevez un accès anticipé à nos produits.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-gray-900/10"
                                        style={{ background: "rgb(245,245,245)", border: "1px solid rgb(230,230,230)" }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Produits qui vous intéressent</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {products.map((product) => {
                                            const isSelected = selectedProducts.includes(product.id);
                                            return (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => toggleProduct(product.id)}
                                                    className="relative flex flex-col items-center gap-1.5 p-4 rounded-xl text-center transition-all duration-200"
                                                    style={{
                                                        background: isSelected ? `${product.color}11` : "rgb(245,245,245)",
                                                        border: `1.5px solid ${isSelected ? product.color : "rgb(230,230,230)"}`,
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: product.color }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                                                    <span className="text-xs text-gray-400 leading-tight">{product.description}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
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
                                            Inscription en cours...
                                        </span>
                                    ) : "Rejoindre la liste d\u0027attente"}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="rgb(255,122,0)" stroke="rgb(255,122,0)" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                        Rejoignez les entreprises africaines qui font confiance à Wozif.
                    </p>
                    <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(156,163,175)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        <span className="text-xs text-gray-400">Vos données sont protégées et ne seront jamais partagées.</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
