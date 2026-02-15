import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AfriFlow - Infrastructure de Paiement pour l'Afrique",
    description: "AfriFlow unifie vos passerelles de paiement, automatise vos réconciliations et sécurise chaque transaction.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="dark" suppressHydrationWarning>
            <body className={`${inter.className} antialiased bg-[#191919] text-white selection:bg-primary selection:text-black overflow-x-hidden`} suppressHydrationWarning>
                {/* Background Pattern Layer */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="bg_pattern_wazzap_conversation opacity-[0.03]" />
                    <div className="absolute inset-0 opacity-[0.02] z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#87a9ff]/5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative z-10">
                    <Providers>
                        {children}
                    </Providers>
                </div>
            </body>
        </html>
    );
}
