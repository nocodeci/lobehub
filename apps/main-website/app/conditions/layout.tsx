import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation",
    description: "Consultez les Conditions Générales d'Utilisation de Wozif. Modalités d'accès et d'utilisation des services Connect, Gnata et AfriFlow.",
    alternates: {
        canonical: "https://wozif.com/conditions",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
