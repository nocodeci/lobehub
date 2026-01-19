import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gnata | Votre Site Web en 1 Heure",
  description: "Plateforme de création de sites web ultra-rapide. Demandez, nous livrons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
