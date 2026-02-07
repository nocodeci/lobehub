import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

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
      <body suppressHydrationWarning className="font-sans antialiased text-foreground selection:bg-primary selection:text-white overflow-x-hidden">
        <AuthProvider>
          {/* Background Layer */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-background" />

          {/* Main Content Area */}
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
