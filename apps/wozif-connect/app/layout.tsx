import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Connect | The WhatsApp Automation Platform",
  description: "Advanced WhatsApp automation, CRM and engagement platform for modern businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased text-white selection:bg-primary selection:text-black overflow-x-hidden`}>
        <AuthProvider>
          {/* Background Pattern Layer */}
          <div className="fixed inset-0 pointer-events-none z-0">
            {/* Pattern Overlay */}
            <div className="bg_pattern_wazzap_conversation opacity-[0.03] dark:opacity-[0.04]" />

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.02] z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Global Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#075E54]/10 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          {/* Main Content Area */}
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
