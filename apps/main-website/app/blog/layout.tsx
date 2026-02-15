import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Actualités tech & numérique en Afrique",
    description: "Découvrez nos articles sur le numérique en Afrique : automatisation WhatsApp, création de sites web, paiements Mobile Money, intelligence artificielle, et tendances tech en Côte d'Ivoire et Afrique francophone.",
    keywords: [
        "blog wozif", "actualités tech afrique", "blog technologie afrique",
        "articles whatsapp business", "guide automatisation whatsapp",
        "tendances numériques afrique", "blog mobile money",
        "articles création site web afrique", "blog IA afrique",
    ],
    openGraph: {
        title: "Blog Wozif — Actualités tech & numérique en Afrique",
        description: "Articles et guides sur le numérique en Afrique : IA, WhatsApp, Mobile Money, création de sites web.",
        url: "https://wozif.com/blogs",
    },
    twitter: {
        title: "Blog Wozif — Actualités tech & numérique en Afrique",
        description: "Articles et guides sur le numérique en Afrique : IA, WhatsApp, Mobile Money, création de sites web.",
    },
    alternates: {
        canonical: "https://wozif.com/blogs",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
