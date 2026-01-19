import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AfriFlow - Orchestrateur de Paiements Souverain",
    description: "La plateforme d'orchestration de paiements pour l'Afrique.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="dark" suppressHydrationWarning>
            <body className={`${inter.className} antialiased bg-[#050505] text-white`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
