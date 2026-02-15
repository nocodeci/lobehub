import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact — Parlons de votre projet",
    description: "Contactez l'équipe Wozif pour discuter de votre projet numérique. Automatisation WhatsApp, création de site web, paiements Mobile Money. Réponse sous 24h. Basé à Abidjan, Côte d'Ivoire.",
    keywords: [
        "contacter wozif", "contact wozif", "devis site web afrique",
        "devis automatisation whatsapp", "agence digitale côte d'ivoire contact",
        "projet numérique afrique", "partenariat tech afrique",
    ],
    openGraph: {
        title: "Contactez Wozif — Parlons de votre projet",
        description: "Une question, un projet ou un partenariat ? Notre équipe vous répond sous 24 heures.",
        url: "https://wozif.com/contact",
    },
    twitter: {
        title: "Contactez Wozif — Parlons de votre projet",
        description: "Une question, un projet ou un partenariat ? Notre équipe vous répond sous 24 heures.",
    },
    alternates: {
        canonical: "https://wozif.com/contact",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
