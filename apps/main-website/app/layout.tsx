import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

const siteUrl = "https://wozif.com";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Wozif — Solutions numériques intelligentes pour l'Afrique | IA, WhatsApp, Paiements & Sites Web",
        template: "%s | Wozif",
    },
    description: "Wozif développe des solutions numériques innovantes pour les entreprises africaines : automatisation WhatsApp avec IA (Connect), création de sites web en 1h (Gnata), et orchestration de paiements Mobile Money (AfriFlow). Basé en Côte d'Ivoire.",
    keywords: [
        // Marque
        "wozif", "wozif technologies", "wozif côte d'ivoire",
        // Produits
        "connect wozif", "gnata wozif", "afriflow wozif",
        // WhatsApp / IA
        "automatisation whatsapp", "chatbot whatsapp", "agent IA whatsapp",
        "whatsapp business automation afrique", "intelligence artificielle afrique",
        "automatisation whatsapp côte d'ivoire", "chatbot whatsapp sénégal",
        // Création de site
        "création site web afrique", "créer site web côte d'ivoire",
        "site web pas cher afrique", "site vitrine afrique",
        "agence web côte d'ivoire", "création site web rapide",
        // Paiements
        "paiement mobile money", "mobile money api", "paiement en ligne afrique",
        "orange money api", "mtn money api", "wave paiement",
        "orchestrateur paiement afrique", "passerelle paiement mobile money",
        // Géographique
        "tech afrique", "startup technologie afrique",
        "solutions numériques côte d'ivoire", "solutions numériques sénégal",
        "solutions numériques cameroun", "digital afrique francophone",
        "entreprise technologie abidjan",
        // Long tail
        "comment automatiser whatsapp business",
        "créer site web en 1 heure",
        "intégrer mobile money sur site web",
        "meilleure solution paiement mobile afrique",
    ],
    authors: [{ name: "Wozif", url: siteUrl }],
    creator: "Wozif Technologies",
    publisher: "Wozif",
    applicationName: "Wozif",
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
        siteName: "Wozif",
        title: "Wozif — Solutions numériques intelligentes pour l'Afrique",
        description: "Automatisation WhatsApp avec IA, création de sites web en 1h, et paiements Mobile Money. Wozif accompagne les entreprises africaines dans leur transformation numérique.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Wozif — Solutions numériques intelligentes pour l'Afrique",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Wozif — Solutions numériques intelligentes pour l'Afrique",
        description: "Automatisation WhatsApp IA, sites web en 1h, paiements Mobile Money. La tech au service des entreprises africaines.",
        creator: "@woziftech",
        site: "@woziftech",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: siteUrl,
    },
    icons: {
        icon: [{ url: "/favicon.ico" }],
        apple: [{ url: "/apple-touch-icon.png" }],
    },
    category: "technology",
    classification: "Business Software",
    other: {
        "msapplication-TileColor": "#1a1a1a",
        "google-site-verification": "votre-code-google-search-console",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    ],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Wozif",
            legalName: "Wozif Technologies",
            url: siteUrl,
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
                width: 512,
                height: 512,
            },
            description: "Entreprise technologique africaine développant des solutions numériques intelligentes : automatisation WhatsApp, création de sites web, et orchestration de paiements Mobile Money.",
            foundingDate: "2024",
            sameAs: [
                "https://youtube.com/@wozif",
                "https://twitter.com/woziftech",
                "https://www.linkedin.com/company/wozif",
                "https://www.instagram.com/woziftech",
            ],
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                areaServed: ["CI", "SN", "CM", "BF", "ML", "TG", "BJ", "GA", "CG", "CD"],
                availableLanguage: ["French", "English"],
            },
            address: {
                "@type": "PostalAddress",
                addressCountry: "CI",
                addressLocality: "Abidjan",
            },
        },
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "Wozif",
            description: "Solutions numériques intelligentes pour l'Afrique",
            publisher: { "@id": `${siteUrl}/#organization` },
            inLanguage: "fr-FR",
        },
        {
            "@type": "SoftwareApplication",
            name: "Connect by Wozif",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://connect.wozif.com",
            description: "Automatisation WhatsApp avec Intelligence Artificielle. Agents IA, chatbots, réponses automatiques et CRM.",
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "XOF",
                description: "Essai gratuit disponible",
            },
            featureList: [
                "Agents IA personnalisés",
                "Chatbots WhatsApp",
                "Réponses automatiques 24h/24",
                "Intégration CRM",
                "Multi-comptes WhatsApp",
            ],
        },
        {
            "@type": "SoftwareApplication",
            name: "Gnata by Wozif",
            applicationCategory: "DesignApplication",
            operatingSystem: "Web",
            url: "https://gnata.wozif.com",
            description: "Création de sites web professionnels en 1 heure. Service humain ultra-rapide à partir de 50 000 FCFA.",
            offers: {
                "@type": "Offer",
                price: "50000",
                priceCurrency: "XOF",
                description: "Site vitrine à partir de 50 000 FCFA",
            },
            featureList: [
                "Site web en 1 heure",
                "Design professionnel",
                "Responsive mobile",
                "Hébergement inclus",
                "Support dédié",
            ],
        },
        {
            "@type": "SoftwareApplication",
            name: "AfriFlow by Wozif",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://afriflow.wozif.com",
            description: "Orchestrateur de paiements africains. Intégrez Mobile Money, cartes et virements avec une seule API.",
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "XOF",
                description: "2% par transaction, pas de frais fixes",
            },
            featureList: [
                "18+ opérateurs Mobile Money",
                "Orange Money, MTN, Wave, Moov",
                "API unique d'intégration",
                "Dashboard temps réel",
                "Réconciliation automatique",
            ],
        },
        {
            "@type": "FAQPage",
            "@id": `${siteUrl}/#faq`,
            mainEntity: [
                {
                    "@type": "Question",
                    name: "Qu'est-ce que Wozif ?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Wozif est une entreprise technologique africaine qui développe des solutions numériques intelligentes : Connect pour l'automatisation WhatsApp avec IA, Gnata pour la création de sites web en 1 heure, et AfriFlow pour l'orchestration des paiements Mobile Money.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Comment fonctionne Connect, l'automatisation WhatsApp ?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Connect utilise l'intelligence artificielle pour créer des agents capables de répondre automatiquement à vos clients sur WhatsApp 24h/24. Vous configurez vos réponses, entraînez votre IA, et Connect gère vos conversations automatiquement.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Combien coûte un site web avec Gnata ?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Un site vitrine professionnel avec Gnata commence à 50 000 FCFA. Le site est livré en 1 heure avec un design moderne, responsive et optimisé pour le référencement.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Dans quels pays Wozif est-il disponible ?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Wozif est disponible dans toute l'Afrique francophone : Côte d'Ivoire, Sénégal, Cameroun, Burkina Faso, Mali, Togo, Bénin, Gabon, Congo, et bien d'autres pays africains.",
                    },
                },
            ],
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="light" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={`${outfit.className} bg-white text-slate-900 antialiased selection:bg-indigo-500/10`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
