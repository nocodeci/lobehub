import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Confidentialité",
    description: "Politique de confidentialité de Wozif. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles sur nos services Connect, Gnata et AfriFlow.",
    alternates: {
        canonical: "https://wozif.com/confidentialite",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
    return children;
}
