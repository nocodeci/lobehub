import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
    title: "Wozif ID | Authentification Unifiée",
    description: "Un seul compte sécurisé pour accéder à tout l'écosystème Wozif, AfriFlow et Gnata.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="light" suppressHydrationWarning>
            <body className={`${outfit.className} bg-white text-slate-900 antialiased selection:bg-indigo-500/10`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
