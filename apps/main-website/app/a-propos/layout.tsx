import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "À propos — Notre mission pour l'Afrique numérique",
    description: "Découvrez Wozif, entreprise technologique africaine basée à Abidjan. Notre mission : démocratiser l'accès au numérique en Afrique avec des solutions intelligentes et accessibles. Connect, Gnata, AfriFlow.",
    keywords: [
        "à propos wozif", "équipe wozif", "mission wozif",
        "startup tech afrique", "entreprise technologie abidjan",
        "innovation numérique afrique", "tech africaine",
        "fondateur wozif", "histoire wozif",
    ],
    openGraph: {
        title: "À propos de Wozif — Notre mission pour l'Afrique numérique",
        description: "Entreprise technologique africaine développant des solutions numériques intelligentes pour les entreprises du continent.",
        url: "https://wozif.com/a-propos",
    },
    twitter: {
        title: "À propos de Wozif — Notre mission pour l'Afrique numérique",
        description: "Entreprise technologique africaine développant des solutions numériques intelligentes pour les entreprises du continent.",
    },
    alternates: {
        canonical: "https://wozif.com/a-propos",
    },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
    return children;
}
