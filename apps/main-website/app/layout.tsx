import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
    title: "Wozif • Des solutions numériques utiles et intelligentes.",
    description: "Wozif combine savoir-faire technologique et intelligence artificielle pour créer des produits numériques qui répondent aux besoins des entreprises africaines.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="light" suppressHydrationWarning>
            <body className={`${outfit.className} bg-white text-slate-900 antialiased selection:bg-indigo-500/10`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
