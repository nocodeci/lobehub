import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect - Écosystème IA WhatsApp",
  description: "Transformez votre communication WhatsApp avec l'intelligence artificielle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={outfit.className}>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
