import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liste d'attente — Accès anticipé aux solutions Wozif",
    description: "Inscrivez-vous à la liste d'attente Wozif et soyez parmi les premiers à accéder à nos solutions : automatisation WhatsApp (Connect), création de sites web (Gnata), et paiements Mobile Money (AfriFlow).",
    keywords: [
        "liste attente wozif", "inscription wozif", "accès anticipé wozif",
        "early access connect", "early access gnata", "early access afriflow",
        "inscription automatisation whatsapp", "inscription site web afrique",
    ],
    openGraph: {
        title: "Rejoignez la liste d'attente Wozif — Accès anticipé",
        description: "Soyez parmi les premiers à accéder à nos solutions numériques pour l'Afrique.",
        url: "https://wozif.com/waitlist",
    },
    twitter: {
        title: "Rejoignez la liste d'attente Wozif — Accès anticipé",
        description: "Soyez parmi les premiers à accéder à nos solutions numériques pour l'Afrique.",
    },
    alternates: {
        canonical: "https://wozif.com/waitlist",
    },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
    return children;
}
