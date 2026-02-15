"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MainNavbar from "@/framer/main-navbar";
import FooterFramer from "@/framer/footer";
import { getArticleBySlug, blogArticles } from "@/lib/blog-data";

const categoryColors: Record<string, string> = {
    Connect: "bg-orange-500/10 text-orange-600",
    Gnata: "bg-emerald-500/10 text-emerald-600",
    AfriFlow: "bg-blue-500/10 text-blue-600",
    Insights: "bg-purple-500/10 text-purple-600",
};

function renderMarkdown(content: string) {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${elements.length}`} className="space-y-2 my-4 pl-6">
                    {listItems.map((item, i) => (
                        <li key={i} className="text-gray-600 list-disc" style={{ lineHeight: 1.7 }}>
                            <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    const inlineFormat = (text: string): string => {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>');
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("#### ")) {
            flushList();
            elements.push(
                <h4 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3" style={{ letterSpacing: "-0.01em" }}>
                    {line.replace("#### ", "")}
                </h4>
            );
        } else if (line.startsWith("### ")) {
            flushList();
            elements.push(
                <h3 key={i} className="text-xl font-bold text-gray-900 mt-10 mb-4" style={{ letterSpacing: "-0.01em" }}>
                    {line.replace("### ", "")}
                </h3>
            );
        } else if (line.startsWith("## ")) {
            flushList();
            elements.push(
                <h2 key={i} className="text-2xl font-bold text-gray-900 mt-12 mb-4" style={{ letterSpacing: "-0.02em" }}>
                    {line.replace("## ", "")}
                </h2>
            );
        } else if (line.startsWith("- ")) {
            listItems.push(line.replace("- ", ""));
        } else if (/^\d+\.\s/.test(line)) {
            flushList();
            listItems.push(line.replace(/^\d+\.\s/, ""));
        } else if (line.trim() === "") {
            flushList();
        } else {
            flushList();
            elements.push(
                <p key={i} className="text-gray-600 my-4" style={{ lineHeight: 1.8 }}>
                    <span dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
                </p>
            );
        }
    }
    flushList();
    return elements;
}

export default function BlogArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = getArticleBySlug(slug);

    if (!article) {
        return (
            <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
                <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                    <MainNavbar.Responsive />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article introuvable</h1>
                        <p className="text-gray-500 mb-8">Cet article n&apos;existe pas ou a été déplacé.</p>
                        <Link href="/blog" className="px-6 py-3 rounded-full text-sm font-medium text-white" style={{ background: "rgb(26,26,26)" }}>
                            Retour au blog
                        </Link>
                    </div>
                </div>
                <FooterFramer.Responsive />
            </div>
        );
    }

    const relatedArticles = blogArticles
        .filter((a) => a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="flex flex-col items-center bg-[rgb(245,245,245)] min-h-screen">
            {/* Navbar */}
            <div style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center" }}>
                <MainNavbar.Responsive />
            </div>

            {/* Article Header */}
            <section className="w-full pt-32 pb-16 px-4" style={{ background: "linear-gradient(180deg, rgb(26,26,26) 0%, rgb(38,38,38) 100%)" }}>
                <div className="max-w-3xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Retour au blog
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                            {article.category}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{article.readTime}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{article.date}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8" style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>
                            {article.author.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{article.author.name}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{article.author.role}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Image */}
            <div className="w-full max-w-4xl mx-auto px-4 -mt-8 relative z-10">
                <div className="rounded-2xl overflow-hidden bg-white aspect-[2/1]" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover !relative"
                    />
                </div>
            </div>

            {/* Article Content */}
            <article className="w-full max-w-3xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl p-8 md:p-12" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {renderMarkdown(article.content)}
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="w-full max-w-6xl mx-auto px-4 pb-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
                        Articles similaires
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedArticles.map((related) => (
                            <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                                <article className="rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-200 hover:-translate-y-1" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}>
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                        <Image
                                            src={related.image}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[related.category] || "bg-gray-100 text-gray-600"}`}>
                                            {related.category}
                                        </span>
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2" style={{ lineHeight: 1.3 }}>
                                            {related.title}
                                        </h3>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <FooterFramer.Responsive />
        </div>
    );
}
