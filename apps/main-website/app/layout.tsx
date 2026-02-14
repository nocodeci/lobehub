import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
    title: "Wozif | L'écosystème IA pour les entreprises africaines",
    description: "Découvrez Connect, la plateforme d'agents IA de Wozif. Automatisez vos opérations, connectez WhatsApp, et boostez votre productivité.",
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
