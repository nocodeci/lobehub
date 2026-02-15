"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";
import { blogArticles } from "@/lib/blog-data";

const categories = ["Tous", "Connect", "Gnata", "AfriFlow", "Insights"];

const categoryColors: Record<string, string> = {
    Connect: "bg-orange-500/10 text-orange-600",
    Gnata: "bg-emerald-500/10 text-emerald-600",
    AfriFlow: "bg-blue-500/10 text-blue-600",
    Insights: "bg-purple-500/10 text-purple-600",
};

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("Tous");

    const filtered =
        activeCategory === "Tous"
            ? blogArticles
            : blogArticles.filter((a) => a.category === activeCategory);

    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
            {/* Navbar */}
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            {/* Hero */}
            <section className="w-full pt-32 pb-16 px-4" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                        Actualités & Ressources
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        Découvrez nos articles sur la transformation digitale en Afrique, les paiements mobiles, l&apos;automatisation WhatsApp et bien plus.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="w-full max-w-6xl mx-auto px-4 -mt-6 relative z-10">
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                            style={{
                                background: activeCategory === cat ? "rgb(26,26,26)" : "white",
                                color: activeCategory === cat ? "white" : "rgb(100,100,100)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Article */}
            {filtered.length > 0 && (
                <section className="w-full max-w-6xl mx-auto px-4 mt-12">
                    <Link href={`/blog/${filtered[0].slug}`} className="group block">
                        <div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
                                    <Image
                                        src={filtered[0].image}
                                        alt={filtered[0].title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[filtered[0].category] || "bg-gray-100 text-gray-600"}`}>
                                            {filtered[0].category}
                                        </span>
                                        <span className="text-xs text-gray-400">{filtered[0].readTime}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors" style={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                                        {filtered[0].title}
                                    </h2>
                                    <p className="text-gray-500 mb-6 line-clamp-3" style={{ lineHeight: 1.7 }}>
                                        {filtered[0].description}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "rgb(26,26,26)" }}>
                                            {filtered[0].author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{filtered[0].author.name}</p>
                                            <p className="text-xs text-gray-400">{filtered[0].date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* Articles Grid */}
            <section className="w-full max-w-6xl mx-auto px-4 mt-12 pb-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.slice(1).map((article) => (
                        <Link key={article.slug} href={`/blog/${article.slug}`} className="group block">
                            <article className="rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-200 hover:-translate-y-1" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                                            {article.category}
                                        </span>
                                        <span className="text-xs text-gray-400">{article.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2" style={{ letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1" style={{ lineHeight: 1.6 }}>
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "rgb(26,26,26)" }}>
                                            {article.author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900">{article.author.name}</p>
                                            <p className="text-[11px] text-gray-400">{article.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Aucun article dans cette catégorie pour le moment.</p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
