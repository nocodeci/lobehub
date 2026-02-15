import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Navbar } from "@/components/Navbar";
import { Footer as SiteFooter } from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"] });

const siteUrl = "https://connect.wozif.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Connect by Wozif - Automatisation WhatsApp avec IA | Agents, Chatbots & CRM",
    template: "%s | Connect by Wozif"
  },
  description: "Connect transforme votre WhatsApp en puissant outil d'automatisation avec intelligence artificielle. Créez des agents IA, chatbots, réponses automatiques et intégrations CRM pour votre business en Côte d'Ivoire, Sénégal, Cameroun et Afrique francophone.",
  keywords: [
    // Mots-clés principaux
    "automatisation whatsapp",
    "agent IA whatsapp",
    "chatbot whatsapp",
    "whatsapp business automation",
    "IA whatsapp",
    "intelligence artificielle whatsapp",
    // Mots-clés géographiques
    "automatisation whatsapp côte d'ivoire",
    "chatbot whatsapp sénégal",
    "whatsapp business cameroun",
    "automatisation whatsapp afrique",
    "agent IA afrique francophone",
    // Mots-clés business
    "crm whatsapp",
    "réponse automatique whatsapp",
    "whatsapp api business",
    "marketing whatsapp",
    "vente whatsapp",
    "service client whatsapp",
    "support client automatisé",
    // Mots-clés techniques
    "api whatsapp",
    "intégration whatsapp",
    "whatsapp cloud api",
    "whatsapp business api",
    // Mots-clés concurrentiels
    "alternative respond.io",
    "alternative wati",
    "meilleur chatbot whatsapp",
    "outil whatsapp business",
    // Mots-clés long tail
    "comment automatiser whatsapp",
    "créer chatbot whatsapp gratuit",
    "agent ia pour entreprise",
    "automatiser réponses whatsapp business"
  ],
  authors: [{ name: "Wozif", url: "https://wozif.com" }],
  creator: "Wozif Technologies",
  publisher: "Wozif",
  applicationName: "Connect by Wozif",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "fr_CI", "fr_SN", "fr_CM"],
    url: siteUrl,
    siteName: "Connect by Wozif",
    title: "Connect - Automatisation WhatsApp avec Intelligence Artificielle",
    description: "Transformez votre WhatsApp en machine de vente automatisée. Agents IA, chatbots intelligents, réponses automatiques et intégrations CRM pour les entreprises africaines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Connect by Wozif - Automatisation WhatsApp avec IA",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 600,
        height: 600,
        alt: "Connect - Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect - Automatisation WhatsApp avec Intelligence Artificielle",
    description: "Créez des agents IA et chatbots WhatsApp pour votre business. La solution #1 en Afrique francophone.",
    creator: "@woziftech",
    site: "@woziftech",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "fr-FR": siteUrl,
      "fr-CI": `${siteUrl}/ci`,
      "fr-SN": `${siteUrl}/sn`,
      "fr-CM": `${siteUrl}/cm`,
      "en-US": `${siteUrl}/en`,
    },
  },
  icons: {
    icon: [
      { url: "/connect-logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/connect-logo.png", type: "image/png" },
    ],
    shortcut: "/connect-logo.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Business Software",
  verification: {
    google: "votre-code-google-search-console",
    // yandex: "votre-code-yandex",
    // bing: "votre-code-bing-webmaster",
  },
  other: {
    "msapplication-TileColor": "#075e54",
    "theme-color": "#075e54",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#075e54" },
  ],
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Wozif",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/connect-logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/woziftech",
        "https://www.linkedin.com/company/wozif",
        "https://www.facebook.com/woziftech",
        "https://www.instagram.com/woziftech",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+225-07-00-00-00-00",
        contactType: "customer service",
        areaServed: ["CI", "SN", "CM", "BF", "ML", "TG", "BJ", "GA", "CG", "CD"],
        availableLanguage: ["French", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Connect by Wozif",
      description: "Plateforme d'automatisation WhatsApp avec Intelligence Artificielle",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "fr-FR",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "Connect",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "9.90",
        highPrice: "39.90",
        priceCurrency: "USD",
        offerCount: "3",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "156",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "Agents IA personnalisés",
        "Chatbots WhatsApp",
        "Réponses automatiques",
        "Intégration CRM",
        "Analyse des conversations",
        "Multi-comptes WhatsApp",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment fonctionne l'automatisation WhatsApp avec Connect ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Connect utilise l'API officielle WhatsApp Business et l'intelligence artificielle pour créer des agents capables de répondre automatiquement à vos clients 24h/24. Configurez vos réponses, entraînez votre IA, et laissez Connect gérer vos conversations.",
          },
        },
        {
          "@type": "Question",
          name: "Est-ce que Connect fonctionne en Côte d'Ivoire et en Afrique ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, Connect est spécialement conçu pour les entreprises africaines. Nous supportons tous les pays d'Afrique francophone incluant la Côte d'Ivoire, le Sénégal, le Cameroun, le Burkina Faso, le Mali, le Togo, le Bénin, et bien d'autres.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le prix de Connect ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Connect propose 3 forfaits : Base à $9.90/mois, Premium Pro à $19.90/mois, et Utilisation Intensive à $39.90/mois. Un essai gratuit avec 500,000 crédits est disponible sans carte de crédit.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={outfit.className}>
        <AntdRegistry>
          <Providers>
            <Navbar />
            {children}
            <SiteFooter />
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
